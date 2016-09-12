'use strict';

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
const commands = {
  '!mxd-help': require('./commands/help.js'),
  '!mxd-join': require('./commands/join.js'),
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
  try {
    const { commandName, args } = require('./modules/commandName.js')({ from, message, replyto });
    if (commandName && commands[commandName]) {
      await commands[commandName]({ admin, args, client, from, reply, replyto });
    }
  } catch(e) {}
});
