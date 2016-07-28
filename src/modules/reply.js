'use strict';

module.exports = ({ client, from, replyto }) => {
  return {
    link: (url, label) => {
      if (label) {
        return `${label} (${url})`;
      }
      return url;
    },
    send: text => {
      if (Array.isArray(text)) {
        text = text.join(', ');
      }
      if (replyto !== from) {
        text = `${from}: ${text}`;
      }
      client.say(replyto, text);
    }
  };
};
