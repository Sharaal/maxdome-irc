'use strict';

module.exports = ({ admin, client, commands, from, message, reply, replyto }) => {
  if (message.length < 2) {
    return;
  }
  if (message[0] !== '!') {
    return;
  }
  const index = message.indexOf(' ');
  let command;
  let args;
  if (index !== -1) {
    command = message.substring(1, index);
    args = message.substring(index + 1);
  } else {
    command = message.substring(1);
  }
  if (!commands[command]) {
    return;
  }
  return commands[command]({ admin, args, client, from, reply, replyto });
};
