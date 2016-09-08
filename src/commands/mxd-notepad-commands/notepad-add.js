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
    await heimdall.post(`mxd/notepad/${session.customer.customerId}`, { contentId: args }, { 'mxd-session': session.sessionId });
    if (title) {
      reply.send(`added asset with title "${title}" to the notepad`);
    } else {
      reply.send(`added asset with id "${args}" to the notepad`);
    }
  } catch (e) {
    if (e.error) {
      reply.send(`notepad-add error "${e.error.message}"`);
    } else {
      reply.send(`notepad-add error "${e.message}"`);
    }
  }
};
