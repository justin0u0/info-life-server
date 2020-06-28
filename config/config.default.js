/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1589185892597_8470';

  // add your middleware config here
  config.middleware = [];

  // security
  config.security = {
    csrf: {
      enable: false,
    },
  };

  // cors
  config.cors = {
    origin: '*',
    allowHeaders: 'Content-Type, Access-Control-Allow-Origin, Authorization',
    allowMethods: 'GET, HEAD, PUT, POST, DELETE',
  };

  // bcrypt
  config.bcrypt = {
    saltRounds: 10,
  };

  return {
    ...config,
  };
};
