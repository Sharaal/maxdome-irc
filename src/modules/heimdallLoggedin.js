module.exports = ({ heimdallSessions }) => ({ loggedin, reply }) => async () => {
  const account = await loggedin();
  if (heimdallSessions.has(account)) {
    const session = heimdallSessions.get(account);
    return { account, session };
  } else {
    reply.send('you are not logged in in maxdome');
    throw new Error('missing maxdome login');
  }
};
