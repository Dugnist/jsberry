const graphqlHTTP = require('express-graphql');
const graphqlTypes = require('graphql');

// connect module configurations
// const localConfig = require('./config.json');

module.exports = ({ ACTIONS, ROUTER }) => {
  /**
   ****************************
   * Configure graphql schema *
   ****************************
   */
  ACTIONS.on('graphql.connect', () => {
    const routerSchema = ROUTER.get('schema');
    const queryFields = {};
    const mutationFields = {};

    for (let name in routerSchema) {
      const sPart = routerSchema[name];
      if (sPart.type === 'query') {
        queryFields[sPart.model] = sPart.operation;
      } else if (sPart.type === 'mutation') {
        mutationFields[sPart.model] = sPart.operation;
      }
    }

    const RootQuery = new graphqlTypes.GraphQLObjectType({
      name: 'Query',
      fields: () => (queryFields),
    });

    const RootMutation = new graphqlTypes.GraphQLObjectType({
      name: 'Mutation',
      fields: () => (mutationFields),
    });

    const schema = new graphqlTypes.GraphQLSchema({
      query: RootQuery,
      mutation: RootMutation,
    });

    const graphqlMiddleware = (req, res, next) => {
      if (req.url.indexOf('/graphql') !== -1) {
        graphqlHTTP({ schema, graphiql: true })(req, res);
      } else {
        next();
      }
    };

    ROUTER.set('middlewares', { graphqlMiddleware }, 999);

    return Promise.resolve();
  });
};
