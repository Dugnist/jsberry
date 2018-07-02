/*
 * JsBerry example: test debugger middleware
 */

 /**
  ******************************************
  * Express/connect/restify implementation *
  ******************************************
  * @param  {function} req - request
  * @param  {function} res - response
  * @param  {function} next - next
  */
module.exports = (req, res, next) => {
  const nowdate = Date.now(); // debugger will show you fresh date value
  debugger;
  next();
};

/**
 **********************************
 *       Koa implementation       *
 **********************************
 * @param  {function} req - request
 * @param  {function} res - response
 * @param  {function} next - next
 */
 // module.exports = async(req, res, next) => {
 //   const nowdate = Date.now(); // debugger will show you fresh date value
 //   debugger;
 //   await next();
 // };
