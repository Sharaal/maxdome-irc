module.exports = ({ heimdall, heimdallSessions }) => async ({ args, heimdallLoggedin, reply }) => {
  const { session } = await heimdallLoggedin();
  try {
    await heimdall.delete(`mxd/notepad/${session.customer.customerId}/content/${args}`, { 'mxd-session': session.sessionId });
    reply.send(`remove asset with id "${args}" from the notepad`);
  } catch (e) {
    if (e.error) {
      reply.send(`notepad-remove error "${e.error.message}"`);
    } else {
      reply.send(`notepad-remove error "${e.message}"`);
    }
  }
};
