/*
 * JsBerry example: simple mongoose user schema
 *
 * how to use:
 *    connect mongoose plugin
 *    create postinit ACTION to convert schema to model
 *    use model as a mongoose plugin query parameter
 */

module.exports = {
  model: null,
  schema: {
    id: { type: String, default: '' },
    login: { type: String, default: '' },
    password: { type: String, default: '' },
    token: { type: String, default: '' },
  },
};
