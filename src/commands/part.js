module.exports = ({ channelStorage }) => async ({ admin, args, client, from, reply, replyto }) => {
  await admin();
  const message = `part requested by "${from}"`;
  if (args) {
    await channelStorage.delete(args);
    client.part(args, message, () => {
      reply.send(`channel "${args}" parted`);
    });
  } else {
    await channelStorage.delete(replyto);
    client.part(replyto, message);
  }
};
