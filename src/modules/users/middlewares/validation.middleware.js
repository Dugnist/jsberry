/*
 * JsBerry example: validation middleware
 */

const { routes } = require('../config.json');
const validation = require('../validation-schemas');

module.exports = (ACTIONS) => async(req, res, next) => {
  try {
    // Find route with searched validation
    const currentRoute = Object.values(routes).find((r) =>
      req.url.indexOf(r.validation.path) !== -1 && // compare url's
      (req.method || '').toLowerCase() === r.method); // compare methods

    // Combine (query | body | params) parameters by config values from request
    const parameters = (currentRoute.validation.parameters || [])
      .map((type) => req[type]).reduce((prev, next) => ({ ...prev, ...next }));

    // Get validation schema by name from config
    const result = validation[currentRoute.validation.schema](parameters);

    if (result.error && result.error.message) {
      throw new Error(result.error.message);
    }

    next();
  } catch (error) {
    res.send({ error: 400, message: error.message });
  }
};
