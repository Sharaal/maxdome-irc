module.exports = ({ heimdall, sessionStorage }) => async ({ heimdallLoggedin, reply }) => {
  const { account, session } = await heimdallLoggedin();
  try {
    console.log(session.sessionId);
    await heimdall.request('auth/logout', {
      headers: { 'mxd-session': session.sessionId },
      method: 'post'
    });
    sessionStorage.del(account);
    reply.send('logout sucessful');
  } catch (e) {
    if (e.error) {
      reply.send(`logout error "${e.error.message}"`);
    } else {
      reply.send(`logout error "${e.message}"`);
    }
  }
};
