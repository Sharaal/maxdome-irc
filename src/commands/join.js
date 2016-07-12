'use strict';

module.exports = async ctx => {
  await ctx.admin();
  ctx.client.join(ctx.command.args);
};
