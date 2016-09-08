module.exports = ({ heimdall, heimdallSessions }) => async ({ args, heimdallLoggedin, reply }) => {
  const { session } = await heimdallLoggedin();
  try {
    let title;
    if (!Number.isInteger(args)) {
      const [asset] = await heimdall.getAssets(args);
      if (!asset) {
        reply.send(`no asset found with name "${args}"`);
        return;
      }
      args = asset.id;
      title = asset.title;
    }
    await heimdall.delete(`mxd/notepad/${session.customer.customerId}/content/${args}`, { 'mxd-session': session.sessionId });
    if (title) {
      reply.send(`removed asset with title "${title}" from the notepad`);
    } else {
      reply.send(`removed asset with id "${args}" from the notepad`);
    }
  } catch (e) {
    if (e.error) {
      reply.send(`notepad-remove error "${e.error.message}"`);
    } else {
      reply.send(`notepad-remove error "${e.message}"`);
    }
  }
};
