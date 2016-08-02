'use strict';

module.exports = ({ admin, client, commands, from, message, reply, replyto }) => {
  if (message.length < 2) {
    return;
  }
  if (message[0] !== '!') {
    return;
  }
  const index = message.indexOf(' ');
  let commandName;
  let args;
  if (index !== -1) {
    commandName = message.substring(1, index);
    args = message.substring(index + 1);
  } else {
    commandName = message.substring(1);
  }
  if (!commands[commandName]) {
    return;
  }
  return commands[commandName]({ admin, args, client, from, reply, replyto });
};
