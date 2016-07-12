'use strict';

module.exports = async ctx => {
  await ctx.admin();
  const message = `part requested by "${ctx.from}"`;
  if (ctx.from === ctx.replyto) {
    ctx.client.part(ctx.command.args, message, () => {
      ctx.reply(`channel "${ctx.command.args}" parted`);
    });
  } else {
    ctx.client.part(ctx.replyto, message);
  }
};
