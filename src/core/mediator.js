/**
 * JsBerry mediator
 * global channels store
 */

const channels = {};

module.exports = class Mediator {

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
    * Unsubscribe channel from store
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

    let result = false;

    Object.keys(channels).map((_action) => {

      if (_action.split(action)[0] === '') {

        const response = channels[_action](payload);

        (response && response.then) ? result = response : false;

      }

    });

    (!result) ? result = Promise.reject(`not handled action ${action}`) : false;

    return result;

  }

  /**
    * Get all actions from registry
    * @return {channels} channels - Return all channels from store.
    */
  getAll() {

    return channels;

  }

};
