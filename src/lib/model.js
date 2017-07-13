/**
 * JsBerry Model
 * tool for the better
 * control of entity's
 */

module.exports = class Model {

  /**
   * Create instance from list of models or other entity's.
   * @param {object} source - Custom object that set the default attributes.
   * Examples:
   *    const entity = new Model({ key: value })
   */
  constructor(source = {}) {

    this.checkForType(source, 'Object');
    this.attributes = {};
    this.add(source);

  }

  /**
   * Clear model
   * @return {instance} this - For chaining methods.
   */
  clear() {

    for (let key in this.attributes) {

      delete this.attributes[key];

    }

    return this;

  }

  /**
   * Get the object with source values
   * @param {array} args - One or more keys that values will be returned.
   * @return {object} result - Object with source values.
   * Examples:
   *    Model.get() - return all existing keys
   *    Model.get('key')
   *    Model.get('key1', 'key2')
   */
  get(...args) {

    const result = {};

    if (args.length === 0) return this.attributes;
    if (args.length === 1) return this.attributes[args[0]];

    for (let i = 0; i < args.length; i += 1) {

      const key = args[i];
      const val = this.attributes[key];

      if (val) result[key] = val;

    }

    return result;

  }

  /**
   * Set items from source to collection
   * @param {object} source - Object with items that will be set.
   * @return {instance} this - For chaining methods.
   */
  set(source = {}) {

    this.checkForType(source, 'Object');
    this.clear();
    this.add(source);

    return this;

  }

  /**
   * Add the select source value
   * @param {object} source - Object with items that will be add.
   * @return {instance} this - For chaining methods.
   * Examples:
   *    Model.add({ key: value })
   */
  add(source = {}) {

    this.checkForType(source, 'Object');

    for (let key in source) {

      this.attributes[key] = source[key];

    }

    return this;

  }

  /**
   * Delete the select source value
   * @param {string} key - Item that need to deleted.
   * @return {instance} this - For chaining methods.
   * Examples:
   *    Model.delete('key')
   */
  delete(key = '') {

    delete this.attributes[key];

    return this;

  }

  /**
   * Method calls the provided function once
   * for each element in an object, in order.
   * @param {function} handler - Function for make operations inside method.
   * @return {array} result - Array of source value/s.
   */
  map(handler = () => {}) {

    this.checkForType(handler, 'Function');

    const result = [];

    for (let i = 0; i < this.keys.length; i += 1) {

      const key = this.keys[i];
      result.push(handler(this.attributes[key], key));

    }

    return result;

  }

  /**
   * Search one item by check for exist
   * @param {string} key - Searched item key.
   * @return {any} value - Searched item value or undefined.
   */
  has(key = '') {

    return typeof this.attributes[key] !== 'undefined'
    ? this.attributes[key]
    : undefined;

  }

  /**
   * Set collection property keys
   * @return {array} keys
   */
  get keys() {

    return Object.keys(this.attributes);

  }

  /**
   * Set collection property length
   * @return {integer} length
   */
  get length() {

    return this.keys.length;

  }

  /**
   * Wrapper to stringify collection
   * @return {string} value
   */
  toJSON() {

    return JSON.stringify(this.attributes);

  }

  /**
   * Check type of item
   * @param {any} source - Object with items that will be check.
   * @param {string} type - Object with items that will be check.
   * @return {boolean}.
   */
  checkForType(source = {}, type = 'Object') {

    const check = Object.prototype.toString.call(source);

    if (!(check === `[object ${type}]`)) throw Error(`Must use an ${type}!`);

    return true;

  }

};
