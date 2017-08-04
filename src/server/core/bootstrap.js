/**
 * JsBerry Bootstrap
 * init application
 */

const CONFIG = require('config');
const MODULES = require(`../${CONFIG.dir.modules}/index`);

const APP = {

  /**
   * [run description]
   */
  run() {

    APP.initLogs();
    APP.initModules();
    APP.catchErrors();

    const apiOptions = {
      origin: CONFIG[CONFIG.mode].origin,
      headers: CONFIG[CONFIG.mode].access_headers,
      methods: CONFIG[CONFIG.mode].access_methods,
      api_path: CONFIG[CONFIG.mode].api_path,
      port: CONFIG[CONFIG.mode].port,
      name: CONFIG.name,
    };

    this.ACTIONS.send('api', apiOptions);

  },

  /**
   * [initModules description]
   */
  initModules() {

    const { ACTIONS, ROUTES } = APP;

    MODULES.map((module) => {

      module({ ACTIONS, ROUTES });

    });

  },

  /**
   * [initLogs description]
   */
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

    this.show = this.Logger(type);

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

  /**
   * [catchErrors description]
   */
  catchErrors() {

    process.on('uncaughtException', (err = {}) => {

      const message = `${process.pid} is die! | Memory: ${this.startMemory}%`;

      this.show.error(message, err.stack);

      setTimeout(() => process.exit(1), 1000);

    });

  },

};

module.exports = APP;
