const AssetsQuery = require('../proxies/assets-query.js');

module.exports = ({ heimdall }) => async ({ args, reply }) => {
  const query = (new AssetsQuery())
    .filter('search', args);
  const assets = await heimdall(query);
  if (assets.length) {
    const lines = assets.map(asset => reply.link(asset.url, asset.title));
    lines.push(reply.link(`https://store.maxdome.de/suche?search=${args}`, 'show all...'));
    reply.send(lines);
  } else {
    reply.send(`no results found for "${args}"`);
  }
};
