/*
 * JsBerry example: validation middleware
 */

const { routes } = require('./config.json');
// const validation = require('../validation-schemas');

/**
 ******************************************
 * Express/connect/restify implementation *
 ******************************************
 * @param  {Events} ACTIONS
 * @param  {Events} ROUTER
 * @return {function} - next
 */
module.exports = (ACTIONS, ROUTER) => async(req, res, next) => {
  try {
    const allRoutes = ROUTER.get('routes');
    const routePath = req.route.path;
    const routeMethod = Object.keys(req.route.methods)[0];

    // Find route with searched validation
    const currentRoute = Object
      .values(allRoutes).find((r) => r.path === routePath.substr(1));
    const validationSchema = await ACTIONS
      .send(`${currentRoute.path.split('/')[0]}.schema.get`);

    // Combine (query | body | params) parameters by config values from request
    const parameters = (currentRoute.validation.parameters || [])
      .map((type) => req[type]).reduce((prev, next) => ({ ...prev, ...next }));

    const resultSchema = (checkFor) => {
      const middlSchema = {};

      Object.keys(validationSchema).forEach((key) => {
        const validate = validationSchema[key].validate;

        middlSchema[key] = Object.keys(validate).reduce((first, value, i) =>
          i < 2 ? checkFor[first]() : first[value](validate[value]));
      });

      return middlSchema;
    };

    // Get validation schema by name from config
    const result = await ACTIONS.send('validate.schema', {
      schema: resultSchema, payload: parameters,
    });

    if (result.error && result.error.message) {
      throw new Error(result.error.message);
    }

    next();
  } catch (error) {
    res.send({ error: 400, message: error.message });
  }
};
