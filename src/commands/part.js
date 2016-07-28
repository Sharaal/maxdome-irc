module.exports = async ({ admin, args, client, from, reply, replyto }) => {
  await admin();
  const message = `part requested by "${from}"`;
  if (from === replyto) {
    client.part(args, message, () => {
      reply.send(`channel "${args}" parted`);
    });
  } else {
    client.part(replyto, message);
  }
};
