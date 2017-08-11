/*
 * JsBerry
 * Source: https://github.com/Dugnist/jsberry
 *
 * Author: Dugnist Alexey (@Dugnist)
 * Released under the MIT license
 */

const CONFIG = require('config');
const Mediator = require('./core/mediator');
const Logger = require('./core/logger');
const processBalancer = require('./core/balancer');
const ROUTER = require('./core/router');
const APP = require('./core/bootstrap');

/* Configure application */

APP.use({
  Logger,
  ROUTER,
  show: new Logger('system'),
  ACTIONS: new Mediator(APP.Logger),
});

/**
 * Debugger vision: node --inspect {path}
 * chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=
 */

global.CONFIG = CONFIG;
global.APP = APP;

/*
 * Start application at several process
 * ToDo: load balancer
 */

const start = (APP = {}) => {

  return (memory = 0) => {

    APP.use({ startMemory: memory });
    APP.run();
    APP.show.log(`Run process | Employed memory: ${memory}%`);

  };

};

(CONFIG.mode === 'dev') ? start(APP)() : processBalancer(start(APP));
