/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = (exports = {});

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1595776143496_2621';

  // add your middleware config here
  config.middleware = [];
  config.multipart = {

    fileExtensions: [ '.blob' ],
    mode: 'file',
    whitelist: () => true,
  };
  config.UPLOAD_FILEPATH = path.resolve(__dirname, '..', 'app/public');
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
    security: {
      csrf: {
        enable: false,
      },
    },
    mongoose: {
      client: {
        url: 'mongodb://127.0.0.1:27017/kkbhub',
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
      },
    },
    jwt: {
      secret: '@kkb123++abc:.',
    },
  };
};
