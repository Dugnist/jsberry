/**
 * JsBerry Bootstrap
 * init application
 */

const CONFIG = require('config');
const MODULES = require(`../${CONFIG.dir.modules}/index`);
const PLUGINS = require(`../${CONFIG.dir.plugins}/index`);

const APP = {

  /**
   * Run application
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
      .catch(warning => this.show.warn(warning));

  },

  /**
   * Connect modules and plugins
   * transfer actions and routes to main tread
   */
  initModules() {

    const { ACTIONS, ROUTER, utils } = APP;

    MODULES.concat(PLUGINS).map((module) => {

      module({ ACTIONS, ROUTER, utils });

    });

  },

  /**
   * Create timer for clearing logs
   * every "clear_logs_time"
   */
  initLogs() {

    setInterval(() => {

      this.show.clear();
      this.setLogger();

    }, CONFIG.clear_logs_time);

  },

  /**
   * Set new Logger instance for application
   * @param {String} type [description]
   */
  setLogger(type = 'system') {

    this.show = this.Logger(type);

  },

  /**
   * Connect start configurations to application
   * @param  {Object} props [description]
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
      this.ACTIONS.send(`${CONFIG.sms_service}.send`, { body: message });

      setTimeout(() => process.exit(1), 1000);

    });

  },

};

module.exports = APP;
