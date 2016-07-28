'use strict';

module.exports = ({ client, from, replyto }) => {
  return {
    link: (url, label) => {
      if (label) {
        return `${label} (${url})`;
      }
      return url;
    },
    send: message => {
      if (Array.isArray(message)) {
        message = message.join('\n');
      }
      if (replyto !== from) {
        message = `${from}: ${message}`;
      }
      client.say(replyto, message);
    }
  };
};
