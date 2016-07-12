'use strict';

module.exports = async ctx => {
  const assets = await ctx.heimdall.search(ctx.command.args);
  if (assets.length) {
    ctx.reply(assets.join(', '));
  } else {
    ctx.reply(`no results found for "${ctx.command.args}"`);
  }
};
