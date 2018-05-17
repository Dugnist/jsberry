const _UserQueries = require('./UserQueries');
const _UserMutations = require('./UserMutations');

module.exports = (ACTIONS) => ({
  user: _UserQueries(ACTIONS).user,
  users: _UserQueries(ACTIONS).users,
  addUser: _UserMutations(ACTIONS).addUser,
});
