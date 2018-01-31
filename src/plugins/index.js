const CONFIG = require('config');
const API = require(`./${CONFIG.framework}_api/index`);
const Websockets = require(`./websockets/index`);
const Twillio = require('./twillio/index');

const PLUGINS = [
  Twillio, Websockets,
];

module.exports = PLUGINS.concat(API);
