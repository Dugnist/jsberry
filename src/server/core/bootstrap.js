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

  },

  initModules() {

    MODULES.map((module) => {

      module(this.ACTIONS);

    });

  },

  initLogs() {

    this.setLogger();

    setInterval(() => {

      this.logger.clear();
      this.setLogger();

    }, CONFIG.clearLogsTime);

  },

  setLogger() {

    this.logger = new Logger('core');
    this.logger.setMode(CONFIG.mode);
    this.ACTIONS = new Mediator(this.logger);

  },

};

module.exports = APP;
