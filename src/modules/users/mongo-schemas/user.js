/*
 * JsBerry example: simple mongoose user schema
 *
 * how to use:
 *    connect mongoose plugin
 *    create postinit ACTION to convert schema to model
 *    use model as a mongoose plugin query parameter
 */

const User = {
  model: null,
  schema: {
    id: { type: String, default: Date.now() },
    login: { type: String, default: '' },
    password: { type: String, default: '' },
    email: { type: String, default: '' },
    token: { type: String, default: '' },
  },
  attachMethods: (userSchema) => {
    userSchema.methods.toAuthKeys = function() {
      return {
        id: this.id,
        login: this.login,
        email: this.email,
        token: this.token,
      };
    };
    return userSchema;
  },
  // attachMethods: false, // if you don't need any methods
};

module.exports = User;
