console.log('begin to start maxdome-irc');

console.log('REDIS_URL: ' + process.env.REDIS_URL);
const redisClient = require('redis').createClient(process.env.REDIS_URL);
const channelStorage = require('mxd-channel-storage')({ client: redisClient });
const sessionStorage = require('mxd-session-storage')({ client: redisClient });

const irc = require('irc');
console.log('IRC_HOST: ' + process.env.IRC_HOST);
console.log('IRC_NICK: ' + process.env.IRC_NICK);
console.log('IRC_SASL: ' + process.env.IRC_SASL, process.env.IRC_SASL === '1');
console.log('IRC_USERNAME: ' + process.env.IRC_USERNAME);
console.log('IRC_PASSWORD: ' + process.env.IRC_PASSWORD);
const ircClient = new irc.Client(process.env.IRC_HOST, process.env.IRC_NICK, {
  debug: true, showErrors: true,
  sasl: process.env.IRC_SASL === '1', username: process.env.IRC_USERNAME, password: process.env.IRC_PASSWORD,
  channels: ['#maxdome-irc']
});
ircClient.addListener('registered', async () => {
  console.log('listener "registered"');
  const client = ircClient;
  const channels = await channelStorage.values();
  for (const channel of channels) {
    client.join(channel);
  }
  client.say(process.env.ADMIN_ID, 'Im here!');
});
ircClient.addListener('error', message => {
  console.log('listener "error"');
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
  '!mxd-channels': require('./commands/channels.js')({ channelStorage }),
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
console.log('end of starting maxdome-irc');
setInterval(() => {
  console.log('ping');
}, 1000);
