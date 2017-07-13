/**
 * JsBerry
 * start application
 */

const cluster = require('cluster');
const numCPUs = require('os').cpus().length;
const APP = require('./core/bootstrap');

if (cluster.isMaster) {

	for (let i = 0; i < numCPUs; i++) {

		cluster.fork();

	}

	cluster.on('exit', (worker, code, signal) => {

		cluster.fork();

	});

} else {

	APP.run();
	APP.logger.log('process is running success!');

	process.on('uncaughtException', (err) => {

		APP.logger.error(`${process.pid} process is die!`, err.stack);

		setTimeout(() => process.exit(), 55);

	});

}

