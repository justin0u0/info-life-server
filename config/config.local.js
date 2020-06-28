/* eslint valid-jsdoc: "off" */

'use strict';

require('dotenv').config({ path: '.env.local' });

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = (appInfo) => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};
  const {
    DATABASE_PREFIX: dbPrefix,
    DATABASE_HOST: dbHost,
    DATABASE_USERNAME: dbUsername,
    DATABASE_PASSWORD: dbPassword,
    DATABASE_NAME: dbName,
  } = process.env;

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

  // mongoose
  config.mongoose = {
    client: {
      url: `${dbPrefix}://${dbUsername}:${dbPassword}@${dbHost}/${dbName}?authSource=admin&w=1`,
      options: {
        keepAlive: true,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
      },
    },
  };

  // jwt
  config.jwt = {
    secret: 'Cdywh7FQ176oWubY5TMMD8nTuZIrQwEp1N9WQWobdgedBW7jMc1tXyQi4ESJFeN',
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
