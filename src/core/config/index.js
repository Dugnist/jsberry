/*
 * JsBerry
 * Source: https://github.com/Dugnist/jsberry
 *
 * general app settings
 *
 * Author: Dugnist Alexey (@Dugnist)
 * Released under the MIT license
 */

const environment = {
  development: require('./development.json'),
  production: require('./production.json'),
};

module.exports = (mode = process.env.NODE_ENV) => Object.assign(
  {
    name: 'JSBerry',
    logs: 'logs',
    sms_service: 'twillio',
    framework: 'express',
    dir: {
      modules: 'modules',
      plugins: 'plugins',
      public: 'public',
    },
  },
environment[mode]);
