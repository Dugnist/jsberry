const Websockets = require(`./websockets/index`);
const Sendmail = require('./sendmail/index');

const PLUGINS = [
  Sendmail, Websockets,
];

module.exports = (CONFIG) => PLUGINS.concat(
  require(`./${CONFIG.framework}_api/index`)
);
