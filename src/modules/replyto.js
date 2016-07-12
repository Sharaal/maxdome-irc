'use strict';

module.exports = ctx => {
  if (ctx.to === ctx.client.nick) {
    ctx.replyto = ctx.from;
  } else {
    ctx.replyto = ctx.to;
  }
};
