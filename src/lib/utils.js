const R = require('ramda');

/**
 * Method for convertation object keys
 * from underscore to dots
 * @param  {object} reference - object for convertation
 * @return {object} - converted object
 */
const _convertkeysToDots = (reference = {}) => {
  const result = {};

  R.keys(reference).map((key) => result[key] = key.replace('_', '.'));

  return result;
};

/**
 * Method for compact transfer callback response
 * to returned promise
 * @param  {function} resolve - promise resolve method
 * @param  {function} reject - promise reject method
 * @return {function} - carried function
 */
const _callbackToPromise = (resolve = () => {}, reject = () => {}) =>
  (error, success) => {
    return (!error) ? resolve({ success }) : reject({ error });
  };

module.exports = {

  convertkeysToDots: _convertkeysToDots,
  callbackToPromise: _callbackToPromise,

};
