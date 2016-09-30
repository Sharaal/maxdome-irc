module.exports = ({ channelStorage }) => async ({ admin, args, client, reply }) => {
  await admin();
  await channelStorage.add(args);
  client.join(args, () => {
    reply.send(`channel "${args}" joined`);
  });
};
