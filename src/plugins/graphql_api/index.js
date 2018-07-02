const graphqlHTTP = require('express-graphql');
const graphqlTypes = require('graphql');

// connect module configurations
// const localConfig = require('./config.json');

module.exports = ({ ACTIONS, ROUTER, show }) => {
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

    const graphqlMiddleware = async(req, res, next) => {
      if ((req.url || '').indexOf('/graphql') !== -1) {
        graphqlHTTP({ schema, graphiql: true })(req, res);
      } else {
        await next();
      }
    };

    ROUTER.set('middlewares', { graphqlMiddleware }, 999);

    return Promise.resolve();
  });

  /**
   *****************************************
   * Start GraphQL middleware notofication *
   *****************************************
   */
  ACTIONS.on('graphql.notify', () => {
    show.log('Run GraphQL middleware');

    return Promise.resolve();
  });
};
