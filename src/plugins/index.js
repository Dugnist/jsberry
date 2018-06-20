const Websockets = require(`./websockets`);
const GraphQL = require(`./graphql_api`);
const Sendmail = require('./sendmail');
const Mongoose = require('./mongoose');

const PLUGINS = [
  Sendmail, Websockets, GraphQL, Mongoose,
];

module.exports = (CONFIG) => PLUGINS.concat(
  require(`./${CONFIG.framework}_api/index`)
);
