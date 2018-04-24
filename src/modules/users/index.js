const { routes, events } = require('./config.json');
const authMiddleware = require('./auth.middleware');

module.exports = ({ ACTIONS, ROUTER, utils }) => {
  /**
   *****************************************
   * GET CORRECT ACTIONS NAMES FROM CONFIG *
   *****************************************
   */

  const { users_auth } = utils.convertkeysToDots(routes);
  const { users_message } = utils.convertkeysToDots(events);

  /**
   *************************************
   * ADD USERS ROUTES TO ACTIONS TREAD *
   *************************************
   */

  ROUTER.set('routes', routes);
  ROUTER.set('events', events);

  /**
   ******************************************
   * ADD USERS MIDDLEWARES TO ACTIONS TREAD *
   ******************************************
   */

  const testMiddleware = (req, res, next) => {
    const nowdate = Date.now(); // debugger will show you fresh date value
    debugger;
    next();
  };

  ROUTER.set('middlewares', { testMiddleware });
  ROUTER.set('middlewares', { authMiddleware: authMiddleware(ACTIONS) }, 1);

  console.log(ROUTER.get('middlewares'));

  /**
   ************************************
   * SUBSCRIBE TO USERS AUTHORIZATION *
   ************************************
   *
   * @param  {object} headers - http headers
   * @param  {object} query - parameters from the url
   * @param  {object} body - parameters from json body
   * @return {promise} - success response or error
   */
  ACTIONS.on(users_auth, ({ headers, query, body }) => {
    const response = { name: 'John', surname: 'Doussss' };

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
   * @return {promise} - success response or error
   */
  ACTIONS.on(users_message, ({ data }) => {
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
