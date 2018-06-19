/*
 * JsBerry example: dummy authorization middleware
 *
 * warning: required database plugin
 */

// get user model
const USER = require('../mongo-schemas/user');

// set path details to error output
const currentPath = __dirname.split('/').slice(-3).join('/');

// KOA test wrapper! Not for production! Use ctx instead (req, res)
// if (!next) res.send = (q) => req.body = JSON.stringify(q);
module.exports = (ACTIONS) => async(req, res, next) => {
  try {
    if (!req.headers.authorization) throw new Error('Empty token!');
    const token = req.headers.authorization.split('Bearer ')[1] || '';
    const user = await ACTIONS // required database plugin!!!
      .send('database.read', { model: USER.model, payload: { token } });
    if (!user) throw new Error('Invalid token!');

    req.auth = user;
    next();
  } catch (error) {
    res.send({ error: 401, message: error.message, path: currentPath });
  }
};
