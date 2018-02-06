/*
 * JsBerry
 * Source: https://github.com/Dugnist/jsberry
 *
 * default router options
 *
 * Author: Dugnist Alexey (@Dugnist)
 * Released under the MIT license
 */

const Router = {

  // REST routers store
  routes: {},
  // WebSockets events
  events: {},
  // GraphQL schema
  schema: {},
  // Middlewares
  middlewares: {},
  // ROUTER.middlewares.mw_name = (app) => {}

  /**
   * Get list of routes/events/schema
   * @param  {String} type - type of queried data
   * @return  {Object} - type of queried data
   */
  get: (type = 'routes') => {
    return Router[type];
  },

  /**
   * [description]
   * @param  {String} type - type of queried data
   * @param  {Object} value - data for addition
   * @return  {this} - for chaining
   */
  set: (type = 'routes', value = {}) => {
    Object.assign(Router.get(type), value);

    return Router;
  },

};

module.exports = Router;
