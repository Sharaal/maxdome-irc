'use strict';

module.exports = ({ client, from, to }) => {
  if (client.nick === to) {
    return from;
  } else {
    return to;
  }
};
