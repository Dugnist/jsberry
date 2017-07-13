/**
 * JsBerry Bootstrap
 * init application
 */

const CONFIG = require('config');
const Mediator = require('./mediator');
const Logger = require('./logger');

const MODULES = require(`../${CONFIG.dir.modules}/index`);

const APP = {

  run() {

    APP.initLogs();
    APP.initModules();

    Mediator.send('users_auth', 'test')
      .then((data) => {

        console.log('data', data);

      });

  },

  initModules() {

    MODULES.map((module) => {

      module(Mediator);

    });

  },

  initLogs() {

    this.createLogger();

    setInterval(() => {

      this.logger.clear();
      this.createLogger();

    }, CONFIG.clearLogsTime);

  },

  createLogger() {

    this.logger = new Logger('core');
    this.logger.setMode(CONFIG.mode);

  },

};

module.exports = APP;
