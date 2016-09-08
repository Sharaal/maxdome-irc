module.exports = ({ heimdall }) => async ({ args, reply }) => {
  reply.send(`Remove "${args}" from the notepad`);
};
