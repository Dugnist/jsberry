const Websockets = require(`./websockets/index`);
const Twillio = require('./twillio/index');

const PLUGINS = [
  Twillio, Websockets,
];

module.exports = (CONFIG) => PLUGINS.concat(
  require(`./${CONFIG.framework}_api/index`)
);
