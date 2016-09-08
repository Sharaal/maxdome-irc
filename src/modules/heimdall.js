const rp = require('request-promise');

module.exports = ({ apikey, appid }) => {
  return {
    post: async (path, body) => {
      return rp.post({
        body,
        url: `https://heimdall.maxdome.de/api/v1/${path}`,
        headers: {
          accept: 'application/json',
          client: 'mxd_package',
          clienttype: 'Webportal',
          'content-type': 'application/json',
          language: 'de_DE',
          'maxdome-origin': 'maxdome.de',
          platform: 'web'
        },
        json: true,
        qs: { apikey, appid }
      });
    }
  };
};
