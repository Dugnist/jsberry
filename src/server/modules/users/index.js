const config = require('./config.json');

const routes = config.routes;
const routes_keys = Object.keys(routes);
const routes_object = {};

const _toDots = (target, key) => target[key] = key.replace('_', '.');
const routesToObject = routes_keys.map((key) => _toDots(routes_object, key));

const { users_auth } = routes_object;

module.exports = ({ ACTIONS, ROUTES }) => {

  /**
   ******************************************
   * ADD USERS ROUTES TO ACTIONS MIDDLEWARE *
   ******************************************
   */

  ROUTES = Object.assign(ROUTES, routes);

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

  });

};
