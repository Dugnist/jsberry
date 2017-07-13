/**
 * JsBerry
 * start application
 */

const os = require('os');
const cluster = require('cluster');
const APP = require('./core/bootstrap');

const numCPUs = os.cpus().length;
const empMemory = () => Math.round(100 * os.freemem() / os.totalmem());

if (cluster.isMaster) {

  for (let i = 0; i < numCPUs; i++) {

    cluster.fork();

  }

  cluster.on('exit', (worker, code, signal) => {

    cluster.fork();

  });

} else {

  APP.run();
  APP.logger.log(`run process | Employed memory: ${empMemory()}%`);

  process.on('uncaughtException', (err) => {

    APP.logger.error(`${process.pid} process is die! |
      Employed memory: ${empMemory()}%`, err.stack);

    setTimeout(() => process.exit(), 55);

  });

}

