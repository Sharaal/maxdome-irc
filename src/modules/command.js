'use strict';

module.exports = commands => ctx => {
  if (ctx.message.length < 2) {
    return;
  }
  if (ctx.message[0] !== '!') {
    return;
  }
  const index = ctx.message.indexOf(' ');
  if (index !== -1) {
    ctx.command = { name: ctx.message.substring(1, index), args: ctx.message.substring(index + 1) };
  } else {
    ctx.command = { name: ctx.message.substring(1) };
  }
  if (commands[ctx.command.name]) {
    commands[ctx.command.name](ctx);
  } else {
    ctx.reply(`unknown command "${ctx.command.name}", use !help to get more information about the available commands`);
  }
};
