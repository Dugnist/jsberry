const { routes, events, schema } = require('./config.json');

// Import user controller
const controller = require('./controller');

// Import user middlewares
const authMiddleware = require('./middlewares/auth.middleware');
const userValidationMiddleware = require('./middlewares/validation.middleware');
const testMiddleware = require('./middlewares/test.middleware');

// Import user graphql schema
const operations = require('./graphql-schema');

// get user schema
const USERSCHEMA = require('./mongo-schemas/user');
const userSchema = require('./schemas/user');

const lol = userSchema;

module.exports = ({ ACTIONS, ROUTER, Model, utils, show }) => {
  /**
   * Send ACTIONS to controller
   */
  const userController = controller(ACTIONS);
  // eslint-disable-next-line
  const USER = Model({ ACTIONS })
    .setModelName('users')
    .setSchema(lol.schema);

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
    userValidationMiddleware: userValidationMiddleware(ACTIONS),
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
   ***********************************************
   * GET MODEL FROM CACHE OR CONVERT FROM SCHEMA *
   ***********************************************
   */
  ACTIONS.on('users.getModel', ({ essense, name }) =>
    (!essense.model) ? // if model not exist in cache
      ACTIONS.send('database.model.create', { // convert schema to model
        name,
        schema: essense.schema,
        attachMethods: essense.attachMethods,
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
  ACTIONS.on('postinit.users', async() => {
    // set user model from schema -> required database plugin!
    ACTIONS.send('users.getModel', { essense: USERSCHEMA, name: 'user' })
      .catch((warning) => show.warn(warning));

    await USER.connectModel();

    return Promise.resolve('success');
  });
};
