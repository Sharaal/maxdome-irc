module.exports = async ({ admin, args, client }) => {
  await admin();
  client.join(args);
};
