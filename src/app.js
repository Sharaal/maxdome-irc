const irc = require('irc');
const client = new irc.Client(process.env.IRC_HOST, process.env.IRC_NICK, { channels: [process.env.IRC_CHANNEL] });

client.addListener('error', message => {
  console.log('error: ', message);
});

const { AssetsQuery, Heimdall } = require('mxd-heimdall');
const heimdall = new Heimdall({
  apikey: process.env.HEIMDALL_APIKEY,
  appid: process.env.HEIMDALL_APPID
});

const sessionStorage = require('mxd-session-storage')({
  url: process.env.REDIS_URL
});

const mxdAuthCommands = require('mxd-auth-commands');
const mxdNotepadCommands = require('mxd-notepad-commands');

const commands = {
  '!mxd-info': require('info-command').commands.info,
  '!mxd-join': require('./commands/join.js'),
  '!mxd-login': mxdAuthCommands.commands['mxd-login']({ heimdall, sessionStorage }),
  '!mxd-logout': mxdAuthCommands.commands['mxd-logout']({ heimdall, sessionStorage }),
  '!mxd-notepad-add': mxdNotepadCommands.commands['mxd-notepad-add']({ heimdall }),
  '!mxd-notepad-remove': mxdNotepadCommands.commands['mxd-notepad-remove']({ heimdall }),
  '!mxd-part': require('./commands/part.js'),
  '!mxd-search': require('mxd-search-command').commands['mxd-search']({
    AssetsQuery: AssetsQuery,
    heimdall: heimdall,
    pageSize: process.env.HEIMDALL_PAGESIZE || 3
  })
};

client.addListener('message', async (from, to, message) => {
  const replyto = require('./modules/replyto.js')({ client, from, to });
  const reply = require('./modules/reply.js')({ client, from, replyto });
  const loggedin = require('./modules/loggedin.js')({ client, from, reply });
  const admin = require('./modules/admin.js')(process.env.ADMIN_ID)({ client, from, loggedin, reply });
  const heimdallLoggedin = mxdAuthCommands.modules['heimdall-loggedin']({ heimdall, sessionStorage })({ loggedin, reply });
  try {
    const { commandName, args } = require('./modules/commandName.js')({ from, message, replyto });
    if (commandName && commands[commandName]) {
      await commands[commandName]({ admin, args, client, heimdallLoggedin, loggedin, from, reply, replyto });
    }
  } catch(e) {
    reply.send(`error "${e.message}"`);
  }
});
