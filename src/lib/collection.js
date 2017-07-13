/**
 * JsBerry Collection
 * tool for the better
 * control list of entity's
 */

const Model = require('./model');

module.exports = class Collection {

  /**
   * Create instance from list of models or other entity's.
   * @param {any} value - Custom value that will add the first child.
   */
  constructor(value) {

    this.list = new Set();

    if (value !== undefined) this.add(value);

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

    const result = [];

    this.list.forEach((value) => {

      result.push(value.get());

    });

    return result;

  }

  /**
   * Set items from source to collection
   * @param {any} source - One or more items that will be set.
   * @return {instance} this - For chaining methods.
   */
  set(source) { // ToDo: 2 obj

    if (!Array.isArray(source)) throw new Error('Value is not an Array type');

    this.clear();

    source.map((item) => {

      this.add(source);
      return true;

    });

    return this;

  }

  /**
   * Add the select source value
   * @param {any} value - Item that need to added.
   * @return {instance} this - For chaining methods.
   */
  add(value) {

    if (value instanceof Model === false) value = new Model(value);

    this.list.add(value);

    return this;

  }

  /**
   * Delete the select source value
   * @param {any} value - Item that need to deleted.
   * @return {instance} this - For chaining methods.
   */
  delete(value) {

    this.list.delete(value);

    return this;

  }

  /**
   * Concat collection with new array
   * @param {array} source - Array that will be concat with collection.
   * @return {instance} this - For chaining methods.
   */
  concat(source) {

    if (!Array.isArray(source)) throw new Error('Value is not an Array type');

    for (let i = 0; i < source.length; i += 1) {

      this.add(source[i]);

    }

    return this;

  }

  /**
   * Search items inside collection by key-value
   * @param {array} key - Key of searched item.
   * @param {array} value - Value of searched item.
   * @return {any} result - Finded source value.
   */
  where(key, value) {

    const list = key;

    if (typeof key === 'object') {

      const name = Object.keys(key)[0];
      key = name;
      value = list[name];

    }

    let result = this.filter((node) => {

      return (node[key] || node.get(key) || null) === value;

    });

    if (result.length === 0) result = false;

    return result;

  }

  /**
   * Method creates an array filled with all
   * array elements that pass a test function
   * @param {function} fn - Function for make operations inside method.
   * @return {array} result - Finded source value/s.
   */
  filter(fn) {

    const result = [];

    this.list.forEach((value) => {

      if (fn(value) === true) result.push(value);

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
  map(handler) {

    if (!handler) throw new Error('Please give callback fn into input value!');

    const result = [];
    let count = 0;

    this.list.forEach((value) => {

      result.push(handler(value, count));
      count++;

    });

    return result;

  }

  /**
   * Search one item by check for exist
   * @param {any} key - Searched item.
   * @return {any} value - Searched item or undefined.
   */
  has(key) {

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

};
