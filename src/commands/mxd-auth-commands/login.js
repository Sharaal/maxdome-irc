module.exports = ({ heimdall, sessionStorage }) => async ({ args, loggedin, reply }) => {
  const account = await loggedin();
  const [userId, phrase] = args.split(' ');
  try {
    const data = await heimdall.request('auth/login', {
      body: { userId, phrase, clientIp: '' },
      method: 'post'
    });
    sessionStorage.set(account, { customer: { customerId: data.customer.customerId }, sessionId: data.sessionId });
    reply.send('login sucessful');
  } catch (e) {
    if (e.error) {
      reply.send(`login error "${e.error.message}"`);
    } else {
      reply.send(`login error "${e.message}"`);
    }
  }
};
