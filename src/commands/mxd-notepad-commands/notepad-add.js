module.exports = ({ heimdall }) => async ({ args, heimdallLoggedin, reply }) => {
  const { session } = await heimdallLoggedin();
  try {
    await heimdall.request(`mxd/notepad/${session.customer.customerId}`, {
      body: { contentId: args },
      headers: { 'mxd-session': session.sessionId },
      method: 'post'
    });
    reply.send(`added asset with id "${args}" to the notepad`);
  } catch (e) {
    if (e.error) {
      reply.send(`notepad-add error "${e.error.message}"`);
    } else {
      reply.send(`notepad-add error "${e.message}"`);
    }
  }
};
