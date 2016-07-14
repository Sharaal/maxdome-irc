'use strict';

const irc = require('irc');
const client = new irc.Client(process.env.IRC_HOST, process.env.IRC_NICK, { channels: [process.env.IRC_CHANNEL] });

client.addListener('error', message => {
  console.log('error: ', message);
});

const commands = {
  help: require('./commands/help.js'),
  join: require('./commands/join.js'),
  part: require('./commands/part.js'),
  'mxd-search': require('./commands/mxd-search.js')
};
const modules = [
  require('./modules/replyto'),
  require('./modules/reply'),
  require('./modules/admin')(process.env.ADMIN_ACCOUNT),
  require('./modules/heimdall')({ apikey: process.env.HEIMDALL_APIKEY, appid: process.env.HEIMDALL_APPID }),
  require('./modules/command')(commands),
];

client.addListener('message', async (from, to, message) => {
  const ctx = { client, from, message, to };
  try {
    for (const module of modules) {
      await module(ctx);
    }
  } catch(e) {}
});
