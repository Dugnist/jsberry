const {
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull,
} = require('graphql');

const UserType = require('./UserType');
const userModel = require('./UserModel');

module.exports = (ACTIONS) => ({
  addUser: {
    type: UserType,
    args: {
      name: {
        name: 'name',
        type: new GraphQLNonNull(GraphQLString),
      },
      surname: {
        name: 'surname',
        type: new GraphQLNonNull(GraphQLString),
      },
      age: {
        name: 'age',
        type: GraphQLInt,
      },
    },
    resolve: (root, { name, surname, age }) => {
      return new Promise((resolve, reject) => {
        userModel(ACTIONS).add({ name, surname, age })
          .then((data) => resolve(data));
      });
    },
  },
});
