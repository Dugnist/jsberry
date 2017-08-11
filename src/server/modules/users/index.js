const { routes } = require('./config.json');

module.exports = ({ ACTIONS, ROUTER }) => {

  /**
   ****************************
   * GET CORRECT ACTIONS NAMES *
   ****************************
   */

  const { users_auth } = ROUTER._convertkeysToDots(routes);

  /**
   ******************************************
   * ADD USERS ROUTES TO ACTIONS MIDDLEWARE *
   ******************************************
   */

  ROUTER.routes = Object.assign(ROUTER.routes, routes);

  /**
   **********************************
   * SUBSCRIBE TO ALL USERS ACTIONS *
   **********************************
   */

  ACTIONS.on(users_auth, (payload) => {

    payload = { name: 1 };

    return (payload.name) ?
      Promise.resolve(payload) :
      Promise.reject({ error: true });

  });

  ACTIONS.on('clear.users.auth', () => {

    // Some magic for clean unstoppable functions (for ex. listen port)

    return Promise.resolve();

  });

};
