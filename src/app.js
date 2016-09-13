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

const sessionStorage = (() => {
  const map = new Map();
  return {
    del: key => map.delete(key),
    get: map.get,
    set: map.set
  };
})();

const mxdAuthCommands = require('mxd-auth-commands');
const mxdNotepadCommands = require('mxd-notepad-commands');

const commands = {
  '!mxd-help': require('./commands/help.js'),
  '!mxd-info': require('info-command').commands.info,
  '!mxd-join': require('./commands/join.js'),
  '!mxd-login': mxdAuthCommands.commands['mxd-login-command']({ heimdall, sessionStorage }),
  '!mxd-logout': mxdAuthCommands.commands['mxd-logout-command']({ heimdall, sessionStorage }),
  '!mxd-nodepad-add': mxdNotepadCommands.commands['mxd-nodepad-add-command']({ heimdall }),
  '!mxd-nodepad-remove': mxdNotepadCommands.commands['mxd-nodepad-remove-command']({ heimdall }),
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
  const admin = require('./modules/admin.js')(process.env.ADMIN_ACCOUNT)({ client, from, reply });
  const loggedin = require('./modules/loggedin.js')({ client, from, reply });
  const heimdallLoggedin = mxdAuthCommands.modules['heimdall-loggedin']({ sessionStorage })({ loggedin, reply });
  try {
    const { commandName, args } = require('./modules/commandName.js')({ from, message, replyto });
    if (commandName && commands[commandName]) {
      await commands[commandName]({ admin, args, client, heimdallLoggedin, loggedin, from, reply, replyto });
    }
  } catch(e) {
    reply.send(`error "${e.message}"`);
  }
});
