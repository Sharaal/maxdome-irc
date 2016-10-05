module.exports = ({ channelStorage }) => async ({ admin, args, client, from, reply, replyto }) => {
  await admin();
  if (args) {
    await channelStorage.delete(args);
    client.part(args, () => {
      if (from === replyto) {
        reply.send(`channel "${args}" parted`);
      }
    });
  } else {
    await channelStorage.delete(replyto);
    client.part(replyto);
  }
};
