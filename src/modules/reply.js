'use strict';

module.exports = ctx => {
  ctx.reply = message => {
    if (ctx.replyto !== ctx.from) {
      message = `${ctx.from}: ${message}`;
    }
    ctx.client.say(ctx.replyto, message);
  };
};
