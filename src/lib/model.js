/**
 * JsBerry Model
 * tool for the better
 * control of entity's
 */

module.exports = class Model {

  /**
   * Create instance from list of models or other entity's.
   * @param {any} value - Custom value that will add the first child.
   */
	constructor(value) {

		this.attributes = {};

		if (value !== undefined) this.set(value);

	}

  /**
	 * Clear model
	 * @return {instance} this - For chaining methods.
	 */
	clear() {

    this.attributes = {};

		return this;

	}

  /**
	 * Get the object with source values
	 * @param {array} args - One or more keys that values will be returned.
	 * @return {object} result - Object with source values.
	 */
	get(...args) {

    const result = {};

    if (args.length === 0) {

      return this.attributes;

    } else if (args.length === 1) {

      return this.attributes[args[0]];

    }

    for (let i = 0; i < arguments.length; i += 1) {

      const key = args[i];
      result[key] = this.attributes[key];

    }

		return result;

	}

  /**
	 * Set items from source to collection
	 * @param {object} source - Object with items that will be set.
	 * @return {instance} this - For chaining methods.
	 */
	set(source) {

    this.clear();
    this.add(source);

    return this;

  }

  /**
	 * Add the select source value
	 * @param {object} source - Object with items that will be add.
	 * @return {instance} this - For chaining methods.
	 */
	add(source) {

    this.attributes = Object.assign(this.attributes, source);

		return this;

  }

  /**
	 * Delete the select source value
	 * @param {string} key - Item that need to deleted.
	 * @return {instance} this - For chaining methods.
	 */
	delete(key) {

		delete this.attributes[key];

		return this;

	}

  /**
	 * Method calls the provided function once
	 * for each element in an object, in order.
	 * @param {function} handler - Function for make operations inside method.
	 * @return {array} result - Array of source value/s.
	 */
	map(handler) {

    const result = [];

    for (let i = 0; i < this.keys.length; i += 1) {

      const key = this.keys[i];
      result.push(handler(this.attributes[key], key));

    }

    return result;

  }

  /**
	 * Search one item by check for exist
	 * @param {any} key - Searched item.
	 * @return {any} value - Searched item or undefined.
	 */
	has(key) {

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

};
