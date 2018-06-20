const { routes, events, schema } = require('./config.json');

// Import user middlewares
const authMiddleware = require('./middlewares/auth.middleware');
const testMiddleware = require('./middlewares/test.middleware');

// Import user graphql schema
const operations = require('./graphql-schema');

// get user schema
const USER = require('./mongo-schemas/user');

// set user options for working with model
const userModelOptions = { essense: USER, name: 'user' };

module.exports = ({ ACTIONS, ROUTER, utils, show }) => {
  /**
   *****************************************
   * GET CORRECT ACTIONS NAMES FROM CONFIG *
   * CONNECT GRAPHQL SCHEMA TO OPERATIONS  *
   *****************************************
   */

  const { users_auth, users_get } = utils.convertKeysToDots(routes);
  const { users_message } = utils.convertKeysToDots(events);
  const userSchema = utils.attachToSchema(schema, operations(ACTIONS));

  /**
   *************************************
   * ADD USERS ROUTES TO ACTIONS TREAD *
   *************************************
   */

  ROUTER.set('routes', routes);
  ROUTER.set('events', events);
  ROUTER.set('schema', userSchema);

  /**
   ******************************************
   * ADD USERS MIDDLEWARES TO ACTIONS TREAD *
   ******************************************
   */

  ROUTER.set('middlewares', { testMiddleware });
  ROUTER.set('middlewares', {
    authMiddleware: authMiddleware(ACTIONS),
  }, 'routes');

  /**
   ************************************
   * SUBSCRIBE TO USERS AUTHORIZATION *
   ************************************
   *
   * @param  {object} headers - http headers
   * @param  {object} query - parameters from the url
   * @param  {object} body - parameters from json body
   * @param  {object} params - parameters from the url split /
   * @return {promise} - success response or error
   */
  ACTIONS.on(users_auth, ({ headers, query, body, params }) => {
    const response = { name: 'John', surname: 'Dou' };

    return (response.name) ?
      Promise.resolve(response) :
      Promise.reject({ error: { message: 'name not exist!' } });
  });

  /**
   ******************************
   * SUBSCRIBE TO USERS MESSAGE *
   ******************************
   *
   * @param  {object} headers - http headers
   * @param  {object} query - parameters from the url
   * @param  {object} body - parameters from json body
   * @param  {object} params - parameters from the url split /
   * @return {promise} - success response or error
   */
  ACTIONS.on(users_get, ({ headers, query, body, params }) => {
    const response = { name: 'John', surname: 'Dou' };

    return (response.name) ?
      Promise.resolve({ event: 'exit', body: response }) :
      Promise.reject({ error: { message: 'name not exist!' } });
  });

  /**
   ***********************************************
   * GET MODEL FROM CACHE OR CONVERT FROM SCHEMA *
   ***********************************************
   */
  ACTIONS.on('users.getModel', ({ essense, name }) =>
    (!essense.model) ? // if model not exist in cache
      ACTIONS.send('database.model.create', { // convert schema to model
        name,
        schema: essense.schema,
      }).then((model) => {
        essense.model = model; // set model to cache and return
        return model;
      }) : // else
      Promise.resolve(essense.model)); // return model from cache

  /**
   *****************************
   * POST INIT LOAD PARAMETERS *
   *****************************
   */
  ACTIONS.on('postinit.users', () => {
    // set user model from schema -> required database plugin!
    ACTIONS.send('users.getModel', userModelOptions)
      .catch((warning) => show.warn(warning));

    return Promise.resolve('success');
  });
};
