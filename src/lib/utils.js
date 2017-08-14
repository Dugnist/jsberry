const R = require('rambda');

const _callbackToPromise = (resolve, reject) => {
  return (error, success) => {
    return (!error) ? resolve({ success }) : reject({ error });
  }
}

module.exports = {

  callbackToPromise: _callbackToPromise,

}