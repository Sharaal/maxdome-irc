module.exports = ({ channelStorage }) => async ({ admin, reply }) => {
  await admin();
  const channels = await channelStorage.values();
  if (channels.length) {
    reply.send(channels.join(', '));
  } else {
    reply.send(`no channels joined`);
  }
};
