'use strict';

const rp = require('request-promise');

module.exports = ({ apikey, appid }) => ctx => {
  ctx.heimdall = {
    search: async term => {
      const query = [
        `apikey=${apikey}`,
        `appid=${appid}`,
        'pageSize=3',
        `filter[]=contentTypeSeriesOrMovies`,
        `filter[]=search~${term}`,
      ].join('&');
      return rp.get({
        url: `https://heimdall.maxdome.de/interfacemanager-2.1/mxd/assets?${query}`,
        headers: {
          accept: 'application/json',
          clienttype: 'Webportal',
          'maxdome-origin': 'de'
        },
        json: true,
        transform: data => data.assetList.map(asset => `${asset.title} http://store.maxdome.de/${asset.id}`)
      });
    }
  }
};
