module.exports = ({ heimdall, heimdallSessions }) => async ({ args, heimdallLoggedin, reply }) => {
  const { session } = await heimdallLoggedin();
  try {
    if (!Number.isInteger(args)) {
      const [asset] = await heimdall.getAssets(args);
      if (!asset) {
        reply.send(`no asset found with name "${args}"`);
        return;
      }
      args = asset.id;
    }
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
