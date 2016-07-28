const rp = require('request-promise');

module.exports = ({ apikey, appid, pageSize }) => async query => {
  query
    .query('apikey', apikey)
    .query('appid', appid)
    .filter('contentTypeSeriesOrMovies');
  if (pageSize) {
    query.query('pageSize', pageSize);
  }
  return rp.get({
    url: `https://heimdall.maxdome.de/interfacemanager-2.1/mxd/assets?${query}`,
    headers: {
      accept: 'application/json',
      clienttype: 'Webportal',
      'maxdome-origin': 'de'
    },
    json: true,
    transform: data => data.assetList.map(asset => {
      return { title: asset.title, url: `http://store.maxdome.de/${asset.id}` };
    })
  });
};
