/**
 * JsBerry Collection
 * tool for the better
 * control list of entity's
 */

const Model = require('./model');

module.exports = class Collection {
  /**
   * Create instance from list of models or other entity's.
   * @param {array} source - Custom source that will add the first child.
   * Examples:
   *    const collection = new Collection({ key: value })
   */
  constructor(source = []) {
    this.list = new Set();
    this.set(source);
  }

  /**
   * Clear collection
   * @return {instance} this - For chaining methods.
   */
  clear() {
    this.list.clear();

    return this;
  }

  /**
   * Get the list of source values
   * @return {array} result - List of source values.
   */
  get() {
    return Array.from(this.list).map((item) => {
      return (item instanceof Model) ? item.get() : item;
    });
  }

  /**
   * Set items from source to collection
   * @param {array} source - One or more items that will be set.
   * @return {instance} this - For chaining methods.
   * Examples:
   *    collection.set([{ key, value }])
   *    collection.set([ value1, value2 ])
   */
  set(source = []) {
    this.checkForType(source, 'Array');
    this.clear();

    source.map((item) => {
      this.add(item);
      return true;
    });

    return this;
  }

  /**
   * Add the select source item
   * @param {any} item - Item that need to added.
   * @return {instance} this - For chaining methods.
   * Examples:
   *    collection.add({ key, value })
   *    collection.add(value)
   */
  add(item = {}) {
    const check = Object.prototype.toString.call(item);

    if (!(item instanceof Model) && check === '[object Object]') {
      item = new Model(item);
    }

    this.list.add(item);

    return this;
  }

  /**
   * Delete the select source value
   * @param {any} value - Item that need to deleted.
   * @return {instance} this - For chaining methods.
   */
  delete(value = {}) {
    this.list.delete(value);

    return this;
  }

  /**
   * Concat collection with new array
   * @param {array} source - Array that will be concat with collection.
   * @return {instance} this - For chaining methods.
   */
  concat(source = []) {
    this.checkForType(source, 'Array');
    this.list = new Set([...this.list, ...source]);

    return this;
  }

  /**
   * Search items inside collection by key-value
   * @param {string} key - Key of searched item.
   * @param {string} value - Value of searched item.
   * @return {any} result - Finded source value.
   */
  where(key = '', value = '') {
    const data = key;

    if (Object.prototype.toString.call(key) === '[object Object]') {
      key = Object.keys(key)[0];
      value = data[key];
    }

    let result = this.filter((node) => {
      return (key === node) ? true :
        (node.get) ? node.get(key) === value : false;
    });

    if (result.length === 0) result = false;

    return result;
  }

  /**
   * Method creates an array filled with all
   * array elements that pass a test function
   * @param {function} handler - Function for make operations inside method.
   * @return {array} result - Finded source value/s.
   */
  filter(handler = () => {}) {
    this.checkForType(handler, 'Function');

    const result = [];

    this.list.forEach((value) => {
      if (handler(value) === true) result.push(value);
    });

    if (result.length === 1) return result[0];

    return result;
  }

  /**
   * Method calls the provided function once
   * for each element in an array, in order.
   * @param {function} handler - Function for make operations inside method.
   * @return {array} result - Array of source value/s.
   */
  map(handler = () => {}) {
    this.checkForType(handler, 'Function');

    const result = [];

    this.list.forEach((value, i) => {
      result.push(handler(value, i));
    });

    return result;
  }

  /**
   * Search one item by check for exist
   * @param {any} key - Searched item.
   * @return {any} value - Searched item or undefined.
   */
  has(key = {}) {
    return this.list.has(key);
  }

  /**
   * Set collection property length
   * @return {integer} length
   */
  get length() {
    return this.list.size;
  }

  /**
   * Wrapper to stringify collection
   * @return {string} value
   */
  toJSON() {
    return JSON.stringify(this.get());
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
