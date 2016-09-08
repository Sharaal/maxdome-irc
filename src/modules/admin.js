module.exports = account => ({ client, from, reply }) => async () => new Promise((resolve, reject) => {
  client.whois(from, info => {
    if (info.account === account) {
      resolve();
    } else {
      reply.send('you are not authorized for the command');
      reject();
    }
  });
});
