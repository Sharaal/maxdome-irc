const rp = require('request-promise');

module.exports = ({ apikey, appid }) => {
  const request = async (method, path, body, headers) => {
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
      headers
    );
    return rp[method]({
      body,
      url: `https://heimdall.maxdome.de/api/v1/${path}`,
      headers,
      json: true,
      qs: { apikey, appid }
    });
  };
  return {
    delete: async (path, headers) => {
      return request('delete', path, undefined, headers);
    },
    post: async (path, body, headers) => {
      return request('post', path, body, headers);
    }
  };
};
