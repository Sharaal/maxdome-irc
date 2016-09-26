module.exports = adminId => ({ client, loggedin, from, reply }) => async () => {
  const account = await loggedin();
  if (account.id !== adminId) {
    throw new Error('you are not authorized for the command');
  }
};
