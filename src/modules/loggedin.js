module.exports = ({ client, from, reply }) => async () => new Promise((resolve, reject) => {
  client.whois(from, info => {
    if (info.account) {
      const account = { id: info.account };
      resolve(account);
    } else {
      reply.send('you are not logged in with an IRC account');
      reject();
    }
  });
});
