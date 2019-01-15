const Joi = require('joi');

const validationMiddleware = require('./validation.middleware');

module.exports = ({ ACTIONS, ROUTER }) => {
  /**
   * Validation middleware
   */
  ROUTER.set('middlewares', {
    userValidationMiddleware: validationMiddleware(ACTIONS, ROUTER),
  }, 'routes');
  /**
   * Send message
   * how to use:
   *  ACTIONS.send('validate.schema', { schema: {}, payload: {} })
   *    .then(success => console.log(success))
   *    .catch((warning) => console.error(warning));
   */
  ACTIONS.on('validate.schema', ({ schema = {}, payload = {} }) => {
    const joiSchema = Joi.object().keys(schema(Joi));

    return Promise.resolve(Joi.validate(payload, joiSchema));
  });
};
