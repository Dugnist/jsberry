const { routes, events, schema } = require('./config.json');

// Import user graphql schema [optional]
const operations = require('./graphql-schema');

// Import user controller
const controller = require('./controller');

// Import user middlewares
const authMiddleware = require('./middlewares/auth.middleware');

// Import user schema
const usrSchema = require('./schemas/user');

module.exports = ({ ACTIONS, ROUTER, Model, utils, show }) => {
  /**
   * Send ACTIONS to controller
   */
  const userController = controller(ACTIONS);

  /**
   * Create user model from schema
   */
  const USER = new Model('users', usrSchema.schema);

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
   * @return {Promise} - success response or error
   */
  ACTIONS.on(users_auth, async({ headers, query, body, params }) => {
    try {
      const { login, password, email } = query;
      const userData = { login, password, email };
      const user = await userController.authorization(userData);

      return user.toAuthKeys();
    } catch (error) {
      return Promise.reject({ error: 401, message: error.message });
    }
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
   * @param  {object} auth - user auth data
   * @return {Promise} - success response or error
   */
  ACTIONS.on(users_get, async({ headers, query, body, params, auth }) => {
    try {
      const id = params.id || query.id;

      if ((auth || {}).id === id) return user.toAuthKeys();

      const user = await userController.getUser({ id });

      return user.toAuthKeys();
    } catch (error) {
      return Promise.reject({ error: 404, message: error.message });
    }
  });

  /**
   *****************************
   * POST INIT LOAD PARAMETERS *
   *****************************
   */
  ACTIONS.on('postinit.users', () => {
    // setTimeout(() => console.log(USER.model.schema), 1000);
    return Promise.resolve('success');
  });
};
