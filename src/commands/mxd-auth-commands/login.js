module.exports = ({ heimdall }) => async ({ args, loggedin, reply }) => {
  const account = await loggedin();
  const [userId, phrase] = args.split(' ');
  try {
    const data = await heimdall.post('auth/login', { userId, phrase, clientIp: '' });
    const sessionId = data.sessionId;
  } catch (e) {
    if (e.error) {
      reply.send(`login error "${e.error.message}"`);
    } else {
      reply.send(`login error "${e.message}"`);
    }
  }
};
