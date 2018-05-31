/*
 * JsBerry example: dummy authorization middleware
 *
 * warning: required database plugin
 */

const USER = require('../mongo-schemas/user');

// set path details to error output
const currentPath = __dirname.split('/').slice(-3).join('/');

module.exports = (ACTIONS) => async(req, res, next) => {
  if (req.headers.authorization) { // check headers key authorization
    const token = req.headers.authorization.split('Bearer ')[1] || '';
    const user = await ACTIONS // required database plugin!!!
      .send('database.read', { model: USER.model, payload: { token } });

    (user) ? // if user found -> add user data to request else return error
      (req.auth = user, next()) :
      res.send({ error: 401, message: 'invalid token', path: currentPath });
  } else {
    res.send({ error: 401, message: 'empty token', path: currentPath });
  }
};
