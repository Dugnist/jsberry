const Websockets = require(`./websockets`);
const GraphQL = require(`./graphql_api`);
const Sendmail = require('./sendmail');
const Mongoose = require('./mongoose');
const Validate = require('./joi_validate');

const PLUGINS = [
  Sendmail, Websockets, GraphQL, Mongoose, Validate,
];

module.exports = (CONFIG) => PLUGINS.concat(
  require(`./${CONFIG.framework}_api/index`)
);
