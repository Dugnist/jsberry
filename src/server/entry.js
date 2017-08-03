/**
 * JsBerry
 * start application
 */

const CONFIG = require('config');
const Mediator = require('./core/mediator');
const Logger = require('./core/logger');
const loadBalancer = require('./core/balancer');
const APP = require('./core/bootstrap');

// Configure application

APP.use({
  Logger,
  show: new Logger('system'),
  ACTIONS: new Mediator(APP.Logger),
});

/**
 * Debugger vision: node --inspect {path}
 * chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=
 */

global.CONFIG = CONFIG;
global.APP = APP;

// Start application at several process

const start = (APP = {}) => {

  return (memory = 0) => {

    APP.use({ startMemory: memory });
    APP.run();
    APP.show.log(`Run process | Employed memory: ${memory}%`);

  };

};

(CONFIG.mode === 'dev') ? start(APP)() : loadBalancer(start(APP));
