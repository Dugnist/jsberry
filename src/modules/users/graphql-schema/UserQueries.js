const {
  GraphQLList,
  GraphQLID,
} = require('graphql');

const UserType = require('./UserType');
const userModel = require('./UserModel');

module.exports = (ACTIONS) => ({
  users: {
    type: new GraphQLList(UserType),
    resolve: userModel(ACTIONS).getAll,
  },
  user: {
    type: UserType,
    args: {
      id: {
        type: GraphQLID,
      },
    },
    resolve: userModel(ACTIONS).getUserByPosition,
  },
});
