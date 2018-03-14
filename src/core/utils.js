module.exports = {

  /**
   * Check any source object for valid type
   * @param  {Object} source Any object
   * @param  {String} type   Expected source type
   * @return {Boolean}        If ok - return true
   */
  checkForType: (source = {}, type = 'Object') => {
    const check = Object.prototype.toString.call(source);
    const parsed = JSON.stringify(source);

    if (!(check === `[object ${type}]`)) {
      throw Error(`${parsed} must use an ${type}!`);
    }

    return true;
  },

};
