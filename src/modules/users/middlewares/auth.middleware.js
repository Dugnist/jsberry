/*
 * JsBerry example: dummy authorization middleware
 *
 * warning: required database plugin
 */


/**
 ******************************************
 * Express/connect/restify implementation *
 ******************************************
 * @param  {Events} ACTIONS
 * @param  {Object} USER
 * @return {function} - next
 */
module.exports = (ACTIONS, USER) => async(req, res, next) => {
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
