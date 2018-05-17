const Websockets = require(`./websockets`);
const GraphQL = require(`./graphql_api`);
const Sendmail = require('./sendmail');

const PLUGINS = [
  Sendmail, Websockets, GraphQL,
];

module.exports = (CONFIG) => PLUGINS.concat(
  require(`./${CONFIG.framework}_api/index`)
);
