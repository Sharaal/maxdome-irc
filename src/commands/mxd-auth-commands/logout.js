module.exports = ({ heimdall, heimdallSessions }) => async ({ heimdallLoggedin, reply }) => {
  reply.send(`logout`);

  const { account, session } = await heimdallLoggedin();
  reply.send(`loggedin in IRC with "${account}" and in maxdome with "${session.sessionId}"`);
};
