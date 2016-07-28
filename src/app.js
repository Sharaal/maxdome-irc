'use strict';

const irc = require('irc');
const client = new irc.Client(process.env.IRC_HOST, process.env.IRC_NICK, { channels: [process.env.IRC_CHANNEL] });

client.addListener('error', message => {
  console.log('error: ', message);
});

const heimdall = require('./proxies/heimdall.js')({
  apikey: process.env.HEIMDALL_APIKEY,
  appid: process.env.HEIMDALL_APPID,
  pageSize: process.env.HEIMDALL_PAGESIZE || 3
});
const commands = {
  help: require('./commands/help.js'),
  join: require('./commands/join.js'),
  part: require('./commands/part.js'),
  'mxd-info': require('./commands/mxd-info.js'),
  'mxd-search': require('./commands/mxd-search.js')({ heimdall })
};

client.addListener('message', async (from, to, message) => {
  const replyto = require('./modules/replyto')({ client, from, to });
  const reply = require('./modules/reply')({ client, from, replyto });
  const admin = require('./modules/admin')(process.env.ADMIN_ACCOUNT)({ client, from, reply });
  try {
    await require('./modules/command')({ admin, client, commands, from, message, reply, replyto });
  } catch(e) {}
});
