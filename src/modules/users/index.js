const { routes, events, schema } = require('./config.json');
const authMiddleware = require('./middlewares/auth.middleware');
const testMiddleware = require('./middlewares/test.middleware');
const operations = require('./graphql-schema');

module.exports = ({ ACTIONS, ROUTER, utils }) => {
  /**
   *****************************************
   * GET CORRECT ACTIONS NAMES FROM CONFIG *
   * CONNECT GRAPHQL SCHEMA TO OPERATIONS  *
   *****************************************
   */

  const { users_auth, users_get } = utils.convertkeysToDots(routes);
  const { users_message } = utils.convertkeysToDots(events);
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
   ***************************
   * CLEAR USER AUTH ACTIONS *
   ***************************
   *
   * method for clean unstoppable functions
   * for example: listen port
   */
  ACTIONS.on('clear.users.auth', () => {
    return Promise.resolve();
  });
};
