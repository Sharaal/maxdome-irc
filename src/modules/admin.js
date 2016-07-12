'use strict';

module.exports = adminAccount => ctx => {
  ctx.admin = () => new Promise((resolve, reject) => {
    ctx.client.whois(ctx.from, info => {
      if (info.account === adminAccount) {
        resolve();
      } else {
        ctx.reply(`you are not authorized for the command "!${ctx.command.name}"`);
        reject();
      }
    });
  });
};
