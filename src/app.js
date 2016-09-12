const irc = require('irc');
const client = new irc.Client(process.env.IRC_HOST, process.env.IRC_NICK, { channels: [process.env.IRC_CHANNEL] });

client.addListener('error', message => {
  console.log('error: ', message);
});

const Heimdall = require('mxd-heimdall').Heimdall;
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

const commands = {
  '!mxd-help': require('./commands/help.js'),
  '!mxd-join': require('./commands/join.js'),
  '!mxd-login': require('./commands/mxd-auth-commands/login.js')({ heimdall, sessionStorage }),
  '!mxd-logout': require('./commands/mxd-auth-commands/logout.js')({ heimdall, sessionStorage }),
  '!mxd-notepad-add': require('./commands/mxd-notepad-commands/notepad-add.js')({ heimdall }),
  '!mxd-notepad-remove': require('./commands/mxd-notepad-commands/notepad-remove.js')({ heimdall }),
  '!mxd-part': require('./commands/part.js'),
  '!mxd-info': require('info-command'),
  '!mxd-search': require('mxd-search-command')({
    heimdall: heimdall,
    pageSize: process.env.HEIMDALL_PAGESIZE || 3
  })
};

client.addListener('message', async (from, to, message) => {
  const replyto = require('./modules/replyto.js')({ client, from, to });
  const reply = require('./modules/reply.js')({ client, from, replyto });
  const admin = require('./modules/admin.js')(process.env.ADMIN_ACCOUNT)({ client, from, reply });
  const loggedin = require('./modules/loggedin.js')({ client, from, reply });
  const heimdallLoggedin = require('./modules/heimdallLoggedin.js')({ sessionStorage })({ loggedin, reply });
  try {
    const { commandName, args } = require('./modules/commandName.js')({ from, message, replyto });
    if (commandName && commands[commandName]) {
      await commands[commandName]({ admin, args, client, heimdallLoggedin, loggedin, from, reply, replyto });
    }
  } catch(e) {}
});
