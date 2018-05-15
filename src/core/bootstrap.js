/*
 * JsBerry
 * Source: https://github.com/Dugnist/jsberry
 *
 * init application
 *
 * Author: Dugnist Alexey (@Dugnist)
 * Released under the MIT license
 */

const CONFIG = require('./config')();
const MODULES = require(`../${CONFIG.dir.modules}/index`)(CONFIG);
const PLUGINS = require(`../${CONFIG.dir.plugins}/index`)(CONFIG);

const APP = {

  /**
   *******************
   * Run application *
   *******************
   *   init history logs
   *   init modules and plugins store
   *   init catching system errors
   *   run all events from API module
   */
  run() {
    APP.initLogs();
    APP.initModules();
    APP.catchErrors();

    this.ACTIONS.send('api')
      .catch((warning) => this.show.warn(warning));
    this.ACTIONS.send('websockets')
      .catch((warning) => this.show.warn(warning));
  },

  /**
   * Connect modules and plugins
   * transfer actions and routes to main thread
   */
  initModules() {
    MODULES.concat(PLUGINS).forEach((module) => {
      module(APP);
    });
  },

  /**
   * Create timer for clearing logs
   * every "clear_logs_time"
   */
  initLogs() {
    setInterval(() => {
      this.show.clear();
      // this.show.init();
    }, CONFIG.clear_logs_time);
  },

  /**
   * Connect start configurations to application
   * @param  {Object} props [description]
   *
   * For example: APP.use({ startMemory: '20%' });
   */
  use(props = {}) {
    for (let key in props) {
      this[key] = props[key];
    }
  },

  /**
   * Catch system errors and exception
   * log every event and send sms notification
   */
  catchErrors() {
    process.on('uncaughtException', (err = {}) => {
      const message = `${process.pid} is die! | Memory: ${this.startMemory}%`;

      this.show.error(message, err.stack);
      this.ACTIONS.send(`${CONFIG.sms_service}.send`, { message });

      setTimeout(() => process.exit(1), 1000);
    });
  },

};

module.exports = APP;
