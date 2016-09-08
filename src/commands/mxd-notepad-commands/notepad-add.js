module.exports = ({ heimdall, heimdallSessions }) => async ({ args, reply }) => {
  reply.send(`Add "${args}" to the notepad`);
};
