const CONFIG = require('config');
const API = require(`./${CONFIG.framework}_api/index`);
const Twillio = require('./twillio/index');

const PLUGINS = [
	Twillio,
];

module.exports = PLUGINS.concat(API);