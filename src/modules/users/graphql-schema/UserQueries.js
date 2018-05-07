const {
  GraphQLList,
  GraphQLID,
} = require('graphql');

import UserType from './UserType';
import userModel from './UserModel';

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
