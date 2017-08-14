/**
 * JsBerry logger
 */

const fs = require('fs');
const CONFIG = require('config');
const clc = require('cli-color');

module.exports = class Logger {

  /**
   * [constructor description]
   * @param  {String} context [description]
   */
  constructor(context = '') {

    this.context = context;
    this.nowDate = new Date(Date.now()).toLocaleString();
    this.fPath = `${CONFIG.logs}/${this.nowDate.replace(/[ ,:]/g, '_')}.log`;

  }

  /**
   * [writeToFile description]
   * @param  {[type]} type    [description]
   * @param  {[type]} message [description]
   */
  writeToFile(type, message) {

    const record = JSON.stringify({ type, message });

    fs.writeFile(this.fPath, record, (err) => this.logMessage(err, clc.red));

  }

  /**
   * [clear description]
   * @param {String} mode [description]
   */
  clear() {

    fs.exists(this.fPath, (exists) => {

      (exists) ?

      fs.unlink(this.fPath, (err) => {

        if (err) this.error('Can\'t delete log file', err);

      }) : false;

    });

  }

  /**
   * [toJSON description]
   * @param  {String} message [description]
   */
  toJSON(any) {

    return JSON.stringify(any);

  }

  /**
   * [log description]
   * @param  {String} message [description]
   */
  log(message = '') {

    this.logMessage(this.toJSON(message), clc.green);

  }

  /**
   * [warn description]
   * @param  {String} message [description]
   */
  warn(message = '') {

    this.logMessage(this.toJSON(message), clc.yellow);
    this.fileLogger('warn', message);

  }

  /**
   * [error description]
   * @param  {String} message [description]
   * @param  {String} trace   [description]
   */
  error(message = '', trace = '') {

    this.logMessage(this.toJSON(message), clc.red);
    this.printStackTrace(trace);
    this.fileLogger('error', message, trace);

  }

  /**
   * [fileLogger description]
   * @param  {String} type  [description]
   * @param  {String} message  [description]
   * @param  {String} trace [description]
   */
  fileLogger(type = 'error', message = '', trace = '') {

    if (CONFIG.mode === 'prod') {

      this.writeToFile(type,
        `${message} ${JSON.stringify(trace).replace(/\\n|"/g, '')}`);

    }

  }

  /**
   * [logMessage description]
   * @param  {String} message [description]
   * @param  {String} color   [description]
   */
  logMessage(message = '', color = '') {

    process.stdout.write(`\n`);
    process.stdout.write(color(`${CONFIG.name} ${process.pid} - `));
    process.stdout.write(`${this.nowDate}  `);
    process.stdout.write(clc.yellow(`[${this.context}] `));
    process.stdout.write(color(message));
    process.stdout.write(`\n`);

  }

  /**
   * [printStackTrace description]
   * @param  {String} trace [description]
   */
  printStackTrace(trace = '') {

    console.log(trace);

  }

};
