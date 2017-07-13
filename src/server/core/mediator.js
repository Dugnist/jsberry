/**
 * JsBerry mediator
 * global channels
 */

const channels = {};

module.exports = class Mediator {

  /**
   * [constructor description]
   * @param  {Object} logger [description]
   */
  constructor(logger = {}) {

    this.Logger = logger;

  }

  /**
    * Subscribe to channel
    * @param {string} action - Action from module.
    * @param {function} fn - Function that will be execute.
    * @return {boolean} - Result of subscribe.
    */
  on(action = '', fn = () => {}) {

    if (typeof fn !== 'function') return false;
    if (!channels.hasOwnProperty(action)) channels[action] = [];

    channels[action] = fn;

  }

  /**
    * Unsubscribe from channel
    * @param {string} action - Action from module.
    * @return {this} actions - Return this for chaining.
    */
  off(action = '') {

    this.send(`clear.${action}`);

    delete channels[action];

    return true;

  }

  /**
    * Send action with payload to chanel parameters
    * @param {string} action - Action from module.
    * @param {object} payload - Parameters that will need to send to the module.
    * @return {boolean} - Result of subscribe.
    */
  send(action = '', payload = {}) {

    let rootChannel = action.split('.');
    let result = false;

    if (rootChannel.length < 1) {

      if (!channels.hasOwnProperty(action)) return false;

      result = channels[action](payload);

    } else {

      for (let _action in channels) {

          if (_action.split('.')[0] === rootChannel[0]) {

            result = channels[_action](payload);

          }

      };

    }

    return result;

  }

  /**
    * Get all actions from registry
    * @return {channels} channels - Return data from channels.
    */
  getAll() {

    return channels;

  }

};
