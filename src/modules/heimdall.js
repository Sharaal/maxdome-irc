const AssetsQuery = require('mxd-heimdall').AssetsQuery;
const rp = require('request-promise');

module.exports = ({ apikey, appid }) => {
  const request = async (method, path, { body, headers, transform }) => {
    headers = Object.assign(
      {
        accept: 'application/json',
        client: 'mxd_package',
        clienttype: 'Webportal',
        'content-type': 'application/json',
        language: 'de_DE',
        'maxdome-origin': 'maxdome.de',
        platform: 'web'
      },
      headers || {}
    );
    if (path.includes('?')) {
      path += '&';
    } else {
      path += '?';
    }
    path += `apikey=${apikey}&appid=${appid}`;
    return rp[method]({
      body: body || {},
      url: `https://heimdall.maxdome.de/api/v1/${path}`,
      headers,
      json: true,
      transform
    });
  };
  return {
    delete: async (path, headers) => {
      return request('delete', path, { headers });
    },
    post: async (path, body, headers) => {
      return request('post', path, { body, headers });
    },
    getAssets: async search => {
      const query = (new AssetsQuery())
        .filter('contentTypeSeriesOrMovies')
        .filter('search', search);
      return await request(
        'get',
        `mxd/assets?${query}`,
        {
          transform: data => data.assetList.map(asset => {
            let title = asset.title;
            if (asset['@class'] === 'MultiAssetTvSeriesSeason') {
              title += ` (Season ${asset.number})`;
            }
            return { id: asset.id, title, description: asset.descriptionShort };
          })
        }
      );
    }
  };
};
