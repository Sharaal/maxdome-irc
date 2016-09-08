module.exports = ({ heimdall, heimdallSessions }) => async ({ args, reply }) => {
  reply.send(`Remove "${args}" from the notepad`);
};
