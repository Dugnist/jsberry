/*
 * JsBerry
 * Source: https://github.com/Dugnist/jsberry
 *
 * Author: Dugnist Alexey (@Dugnist)
 * Released under the MIT license
 */

const CONFIG = require('config');
const Logger = require('./core/logger');
const ROUTER = require('./core/router');
const APP = require('./core/bootstrap');
const Mediator = require('./core/mediator');
const processBalancer = require('./core/balancer');
const utils = require('./lib/utils.js');
const Model = require('./lib/model.js');
const Collection = require('./lib/collection.js');

/**
 *************************
 * Configure application *
 *************************
 */

APP.use({
  utils,
  ROUTER,
  Model,
  Collection,
  show: new Logger('system'),
  ACTIONS: new Mediator(),
});

/**
 * Turn entity's to global debug console
 * debugger vision: npm run inspect
 * chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=${uuid}
 * where "uuid" - debug session id from console
 */

global.CONFIG = CONFIG;
global.APP = APP;
global.Model = Model;
global.Collection = Collection;

/**
 ****************************************
 * Start application at several process *
 * ToDo: load balancer                  *
 ****************************************
 */

const start = (APP = {}) => {

  return (memory = 0) => {

    APP.use({ startMemory: memory });
    APP.run();
    APP.show.log(`Run app | Employed memory: ${memory}%`);

  };

};

(CONFIG.mode === 'dev') ? start(APP)() : processBalancer(start(APP));
