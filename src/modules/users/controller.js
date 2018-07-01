// get user schema
const USER = require('./mongo-schemas/user');

module.exports = (ACTIONS) => ({
  /**
   * User authorization handler
   * @param  {String} login - user login
   * @param  {String} password - user password
   * @param  {String} email - user email
   * @return {Promise} - user object
   */
  authorization: async({ login, password, email }) => {
    const userOptions = { model: USER.model, payload: { login } };
    const user = await ACTIONS.send('database.read', userOptions);

    if (!user) {
      userOptions.payload = { login, password, email };

      return ACTIONS.send('database.create', userOptions);
    } else {
      if (user.password !== password) throw new Error('Incorrect password!');

      return user;
    }
  },
  /**
   * User get info handler
   * @param  {String} id - user id
   * @return {Promise} - user object
   */
  getUser: async({ id }) => {
    const userOptions = { model: USER.model, payload: { id } };
    const user = await ACTIONS.send('database.read', userOptions);

    if (!user) throw new Error(`Incorrect ID: ${id}!`);

    return user;
  },
});
