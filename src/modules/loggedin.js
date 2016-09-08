'use strict';

module.exports = ({ client, from, reply }) => async () => new Promise((resolve, reject) => {
  client.whois(from, info => {
    if (info.account) {
      resolve(info.account);
    } else {
      reply.send('you are not logged in with an IRC account');
      reject();
    }
  });
});
