/*
 * JsBerry example: dummy authorization middleware
 *
 * warning: required database plugin
 */

// get user model
const USER = require('../mongo-schemas/user');

// KOA test wrapper! Not for production! Use ctx instead (req, res)
// if (!next) res.send = (q) => req.body = JSON.stringify(q);
module.exports = (ACTIONS) => async(req, res, next) => {
  try {
    if (!req.headers.authorization) throw new Error('Empty token!');
    if (!req.headers.authorization.split(' ')[0] === 'Token' ||
        !req.headers.authorization.split(' ')[0] === 'Bearer') {
      throw new Error('Invalid token format!');
    }
    const token = req.headers.authorization.split(' ')[1] || '';
    const user = await ACTIONS
      .send('database.read', { model: USER.model, payload: { token } });
    if (!user) throw new Error('Invalid token!');

    req.auth = user;
    next();
  } catch (error) {
    res.send({ error: 401, message: error.message });
  }
};
