module.exports = ({ heimdall, heimdallSessions }) => async ({ heimdallLoggedin, reply }) => {
  const { account, session } = await heimdallLoggedin();
  try {
    await heimdall.post('auth/logout', undefined ,{ 'mxd-session': session.sessionId });
    heimdallSessions.delete(account);
    reply.send('logout sucessful');
  } catch (e) {
    if (e.error) {
      reply.send(`logout error "${e.error.message}"`);
    } else {
      reply.send(`logout error "${e.message}"`);
    }
  }
};
