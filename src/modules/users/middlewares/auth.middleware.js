/*
 * JsBerry example: dummy authorization middleware
 *
 * warning: required database plugin
 */

const USER = require('../mongo-schemas/user');

/**
 ******************************************
 * Express/connect/restify implementation *
 ******************************************
 * @param  {Events} ACTIONS
 * @return {function} - next
 */
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

/**
 **********************************
 *       Koa implementation       *
 **********************************
 * @param  {Events} ACTIONS
 * @return {function} - next
 */
// module.exports = (ACTIONS) => async(ctx, next) => {
//   try {
//     if (!ctx.request.headers.authorization) throw new Error('Empty token!');
//     if (!ctx.request.headers.authorization.split(' ')[0] === 'Token' ||
//         !ctx.request.headers.authorization.split(' ')[0] === 'Bearer') {
//       throw new Error('Invalid token format!');
//     }
//     const token = ctx.request.headers.authorization.split(' ')[1] || '';
//     const user = await ACTIONS
//       .send('database.read', { model: USER.model, payload: { token } });
//     if (!user) throw new Error('Invalid token!');
//
//     ctx.request.auth = user;
//     await next();
//   } catch (error) {
//     ctx.body = { error: 401, message: error.message };
//   }
// };
