'use strict';

const irc = require('irc');
const client = new irc.Client(process.env.IRC_HOST, process.env.IRC_NICK, { channels: [process.env.IRC_CHANNEL] });

client.addListener('error', message => {
  console.log('error: ', message);
});

const heimdallAssets = require('mxd-heimdall').heimdall({
  apikey: process.env.HEIMDALL_APIKEY,
  appid: process.env.HEIMDALL_APPID,
  pageSize: process.env.HEIMDALL_PAGESIZE || 3
});
const heimdall = require('./modules/heimdall')({
  apikey: process.env.HEIMDALL_APIKEY,
  appid: process.env.HEIMDALL_APPID
});

const commands = {
  '!mxd-help': require('./commands/help.js'),
  '!mxd-join': require('./commands/join.js'),
  '!mxd-login': require('./commands/mxd-auth-commands/login.js')({ heimdall }),
  '!mxd-logout': require('./commands/mxd-auth-commands/logout.js')({ heimdall }),
  '!mxd-notepad-add': require('./commands/mxd-notepad-commands/notepad-add.js')({ heimdall }),
  '!mxd-notepad-remove': require('./commands/mxd-notepad-commands/notepad-remove.js')({ heimdall }),
  '!mxd-part': require('./commands/part.js'),
  '!mxd-info': require('info-command'),
  '!mxd-search': require('mxd-search-command')({ heimdall: heimdallAssets })
};

client.addListener('message', async (from, to, message) => {
  const replyto = require('./modules/replyto.js')({ client, from, to });
  const reply = require('./modules/reply.js')({ client, from, replyto });
  const admin = require('./modules/admin.js')(process.env.ADMIN_ACCOUNT)({ client, from, reply });
  try {
    const { commandName, args } = require('./modules/commandName.js')({ from, message, replyto });
    if (commandName && commands[commandName]) {
      await commands[commandName]({ admin, args, client, from, reply, replyto });
    }
  } catch(e) {}
});
