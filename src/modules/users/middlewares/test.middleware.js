/*
 * JsBerry example: test debugger middleware
 */
module.exports = (req, res, next) => {
  const nowdate = Date.now(); // debugger will show you fresh date value
  debugger;
  next();
};
