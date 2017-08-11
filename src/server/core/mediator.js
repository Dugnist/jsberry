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
    * @return {callback} - Result of subscribe.
    */
  send(action = '', payload = {}) {

    let result = null;

    Object.keys(channels).map((_action) => {

      if (_action.split(action)[0] === '') {

        result = channels[_action](payload);

      }

    });

    if (!result) result = Promise.reject(`not handled action ${action}`);

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
