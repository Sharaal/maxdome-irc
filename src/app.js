const redisClient = require('redis').createClient(process.env.REDIS_URL);
const channelStorage = require('mxd-channel-storage')({ redisClient });
const sessionStorage = require('mxd-session-storage')({ redisClient });

const irc = require('irc');
const ircClient = new irc.Client(process.env.IRC_HOST, process.env.IRC_NICK, {
  channels: [process.env.IRC_CHANNEL]
});
ircClient.addListener('registered', async () => {
  const channels = await channelStorage.values();
  for (const channel of channels) {
    ircClient.join(channel);
  }
});
ircClient.addListener('error', message => {
  console.log('error: ', message);
});

const mxdAuthCommands = require('mxd-auth-commands');
const mxdNotepadCommands = require('mxd-notepad-commands');

const { AssetsQuery, Heimdall } = require('mxd-heimdall');
const heimdall = new Heimdall({
  apikey: process.env.HEIMDALL_APIKEY,
  appid: process.env.HEIMDALL_APPID
});

const commands = {
  '!mxd-info': require('info-command').commands.info,
  '!mxd-join': require('./commands/join.js')({ channelStorage }),
  '!mxd-login': mxdAuthCommands.commands['mxd-login']({ heimdall, sessionStorage }),
  '!mxd-logout': mxdAuthCommands.commands['mxd-logout']({ heimdall, sessionStorage }),
  '!mxd-notepad-add': mxdNotepadCommands.commands['mxd-notepad-add']({ heimdall }),
  '!mxd-notepad-remove': mxdNotepadCommands.commands['mxd-notepad-remove']({ heimdall }),
  '!mxd-part': require('./commands/part.js')({ channelStorage }),
  '!mxd-search': require('mxd-search-command').commands['mxd-search']({
    AssetsQuery: AssetsQuery,
    heimdall: heimdall,
    pageSize: process.env.HEIMDALL_PAGESIZE || 3
  })
};

ircClient.addListener('message', async (from, to, message) => {
  const replyto = require('./modules/replyto.js')({ client: ircClient, from, to });
  const reply = require('./modules/reply.js')({ client: ircClient, from, replyto });
  const loggedin = require('./modules/loggedin.js')({ client: ircClient, from, reply });
  const admin = require('./modules/admin.js')(process.env.ADMIN_ID)({ client: ircClient, from, loggedin, reply });
  const heimdallLoggedin = mxdAuthCommands.modules['heimdall-loggedin']({ heimdall, sessionStorage })({ loggedin, reply });
  try {
    const { commandName, args } = require('./modules/commandName.js')({ from, message, replyto });
    if (commandName && commands[commandName]) {
      await commands[commandName]({ admin, args, client: ircClient, from, heimdallLoggedin, loggedin, reply, replyto });
    }
  } catch(e) {
    reply.send(`error "${e.message}"`);
  }
});
