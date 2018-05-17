/*
 * JsBerry
 * Source: https://github.com/Dugnist/jsberry
 *
 * helper tools
 *
 * Author: Dugnist Alexey (@Dugnist)
 * Released under the MIT license
 */

const R = require('ramda');
const util = require('util');

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
 * Check any source object for valid type
 * @param  {Object} source Any object
 * @param  {String} type   Expected source type
 * @return {Boolean}        If ok - return true
 */
const _checkForType = (source = {}, type = 'Object') => {
  const check = Object.prototype.toString.call(source);
  const parsed = JSON.stringify(source);

  if (!(check === `[object ${type}]`)) {
    throw Error(`${parsed} must use an ${type}!`);
  }

  return true;
};

/**
 * Method for attach essense operations
 * from graphql markup to router schema
 * @param  {object} schema - routing schema
 * @param  {object} operations - model operations
 * @return {object} - converted object
 */
const _attachToSchema = (schema = {}, operations = {}) => {
  for (let name in schema) {
    const schemaPart = schema[name];
    schema[name].operation = operations[schemaPart.model];
  }
  return schema;
};

module.exports = {
  promisify: util.promisify,
  convertkeysToDots: _convertkeysToDots,
  checkForType: _checkForType,
  attachToSchema: _attachToSchema,
};
