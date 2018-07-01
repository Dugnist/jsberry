const Joi = require('joi');

const schema = Joi.object().keys({
    id: Joi.string().regex(/^[a-zA-Z0-9_]{6,30}$/).required(),
});

module.exports = (payload) => Joi.validate(payload, schema);
