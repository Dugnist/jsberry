const Joi = require('joi');

module.exports = ({ ACTIONS }) => {
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
