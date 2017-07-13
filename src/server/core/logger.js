/**
 * JsBerry logger
 */

const fs = require('fs');
const CONFIG = require('config');
const winston = require('winston');
const clc = require('cli-color');

module.exports = class Logger {

  /**
   * [constructor description]
   * @param  {String} context [description]
   */
  constructor(context = '') {

    this.context = context;
    this.yellow = clc.xterm(3);

    this.nowDate = new Date(Date.now()).toLocaleString();
    this.fPath = `${CONFIG.logs}/${this.nowDate.replace(/[ ,:]/g, '_')}.log`;

    this.fileLogger = new (winston.Logger)({
      transports: [
        new (winston.transports.File)({
          name: 'error-file',
          filename: this.fPath,
          level: 'error',
        }),
      ],
    });

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
   * [setMode description]
   * @param {String} mode [description]
   */
  setMode(mode = 'dev') {

    this.mode = mode;

  }

  /**
   * [log description]
   * @param  {String} message [description]
   */
  log(message = '') {

    this.logMessage(message, clc.green);

  }

  /**
   * [error description]
   * @param  {String} message [description]
   * @param  {String} trace   [description]
   */
  error(message = '', trace = '') {

    this.logMessage(message, clc.red);
    this.printStackTrace(trace);
    this.writeToFile('error', message, trace);

  }

  /**
   * [warn description]
   * @param  {String} message [description]
   */
  warn(message = '') {

    this.logMessage(message, clc.yellow);
    this.writeToFile('warn', message);

  }

  /**
   * [writeToFile description]
   * @param  {String} type  [description]
   * @param  {String} message  [description]
   * @param  {String} trace [description]
   */
  writeToFile(type = 'error', message = '', trace = '') {

    if (this.mode === CONFIG.production.mode) {

      this.fileLogger.log(type,
        `${message} ${JSON.stringify(trace).replace(/\\n/g, '')}`);

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
    process.stdout.write(this.yellow(`[${this.context}] `));
    process.stdout.write(color(message));
    process.stdout.write(`\n`);

  }

  /**
   * [printStackTrace description]
   * @param  {String} trace [description]
   */
  printStackTrace(trace = '') {

    process.stdout.write(trace);
    process.stdout.write(`\n`);

  }

};
