/**
 * JsBerry Bootstrap
 * init application
 */

const CONFIG = require('config');
const Logger = require('./logger');

const MODULES = require(`../${CONFIG.dir.modules}/index`);

const APP = {

  run() {

    APP.initLogs();
    APP.initModules();
    APP.catchErrors();

    // setTimeout(() => lol === 1, 2000);

  },

  initModules() {

    MODULES.map((module) => {

      module(this.ACTIONS);

    });

  },

  initLogs() {

    setInterval(() => {

      this.show.clear();
      this.setLogger();

    }, CONFIG.clearLogsTime);

  },

  /**
   * [setLogger description]
   * @param {String} type [description]
   */
  setLogger(type = 'system') {

    this.show = new Logger(type);

  },

  /**
   * [use description]
   * @param  {Object} props [description]
   */
  use(props = {}) {

    for (let key in props) {

      this[key] = props[key];

    }

  },

  catchErrors() {

    process.on('uncaughtException', (err = {}) => {

      const message = `${process.pid} is die! | Memory: ${this.startMemory}%`;

      this.show.error(message, err.stack);

      setTimeout(() => process.exit(1), 1000);

    });

  },

};

module.exports = APP;
