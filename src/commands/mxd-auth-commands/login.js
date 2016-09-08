module.exports = ({ heimdall, heimdallSessions }) => async ({ args, loggedin, reply }) => {
  const account = await loggedin();
  const [userId, phrase] = args.split(' ');
  try {
    const data = await heimdall.post('auth/login', { userId, phrase, clientIp: '' });
    heimdallSessions.set(account, { sessionId: data.sessionId });
    reply.send('login sucessful');
  } catch (e) {
    if (e.error) {
      reply.send(`login error "${e.error.message}"`);
    } else {
      reply.send(`login error "${e.message}"`);
    }
  }
};
