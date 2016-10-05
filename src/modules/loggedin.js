module.exports = ({ client, from }) => async () => new Promise((resolve, reject) => {
  client.whois(from, (info) => {
    if (info.account) {
      const account = { id: info.account };
      resolve(account);
    } else {
      reject(new Error('you are not logged in with an IRC account'));
    }
  });
});
