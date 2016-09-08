module.exports = ({ heimdall }) => async ({ args, reply }) => {
  reply.send(`Add "${args}" to the notepad`);
};
