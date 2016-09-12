module.exports = ({ heimdall }) => async ({ args, heimdallLoggedin, reply }) => {
  const { session } = await heimdallLoggedin();
  try {
    await heimdall.request(`mxd/notepad/${session.customer.customerId}/content/${encodeURIComponent(args)}`, {
      headers: { 'mxd-session': session.sessionId },
      method: 'delete'
    });
    reply.send(`removed asset with id "${args}" from the notepad`);
  } catch (e) {
    if (e.error) {
      reply.send(`notepad-remove error "${e.error.message}"`);
    } else {
      reply.send(`notepad-remove error "${e.message}"`);
    }
  }
};
