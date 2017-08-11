module.exports = {

  routes: {},

  _convertkeysToDots: (obj) => {

  	const result = {};

  	Object.keys(obj).map(key => result[key] = key.replace('_', '.'));

  	return result;

  },

};
