'use strict';

const irc = require('irc');
const client = new irc.Client(process.env.IRC_HOST, process.env.IRC_NICK, { channels: [process.env.IRC_CHANNEL] });

client.addListener('error', message => {
  console.log('error: ', message);
});

const heimdall = require('mxd-heimdall').heimdall({
  apikey: process.env.HEIMDALL_APIKEY,
  appid: process.env.HEIMDALL_APPID,
  pageSize: process.env.HEIMDALL_PAGESIZE || 3
});
const commands = {
  'mxd-help': require('./commands/help.js'),
  'mxd-join': require('./commands/join.js'),
  'mxd-part': require('./commands/part.js'),
  'mxd-info': require('info-command'),
  'mxd-search': require('mxd-search-command')({ heimdall })
};

client.addListener('message', async (from, to, message) => {
  const replyto = require('./modules/replyto')({ client, from, to });
  const reply = require('./modules/reply')({ client, from, replyto });
  const admin = require('./modules/admin')(process.env.ADMIN_ACCOUNT)({ client, from, reply });
  try {
    await require('./modules/command')({ admin, client, commands, from, message, reply, replyto });
  } catch(e) {}
});
