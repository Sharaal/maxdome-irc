module.exports = async ({ admin, args, client, reply }) => {
  await admin();
  client.join(args, () => {
    reply.send(`channel "${args}" joined`);
  });
};
