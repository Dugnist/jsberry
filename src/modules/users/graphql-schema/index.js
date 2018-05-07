const _UserType = require('./UserType');
const _UserQueries = require('./UserQueries');
const _UserMutations = require('./UserMutations');

module.exports = (ACTIONS) => ({
  UserType: _UserType(ACTIONS),
  UserQueries: _UserQueries(ACTIONS),
  UserMutations: _UserMutations(ACTIONS),
});


// Schema
//
// import {
//   UserQueries,
//   UserMutations,
//   UserType,
// } from './Models/User';

// let RootQuery = new GraphQLObjectType({
//   name: 'Query',
//   fields: () => ({
//     user: UserQueries.user,
//     users: UserQueries.users,
//   }),
// });

// let RootMutation = new GraphQLObjectType({
//   name: 'Mutation',
//   fields: () => ({
//     addUser: UserMutations.addUser,
//   }),
// });

// let schema = new GraphQLSchema({
//   query: RootQuery,
//   mutation: RootMutation,
// });

// export default schema;
