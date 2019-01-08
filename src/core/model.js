module.exports = function({ ACTIONS }) {
  return {

    name: null,
    model: null, // check: set, save
    schema: null,

    setModelName: function(name = '') {
      if (!this.name) {
        this.name = name;
      } else {
        throw new Error(`Model already have name ${this.name}!`);
      }

      return this;
    },

    setSchema: function(schema = {}) {
      if (!this.schema) {
        this.schema = schema;
      } else {
        throw new Error(`Schema already set for ${this.name}!`);
      }

      return this;
    },

    connectModel: async function() {
      const checkDB = await ACTIONS.send('database.check');

      if (!checkDB) throw new Error('Database plugin not connected!');
      if (!this.name) throw new Error('Model don\'t have any name!');
      if (!this.schema) throw new Error('Model don\'t have any schema!');
      if (!this.model) {
        const cleanSchema = this.clearSchema(['validate']); // clear from keys

        console.log(cleanSchema);

        this.model = await ACTIONS.send('database.model.create', {
          name: this.name, schema: cleanSchema,
          attachMethods: this.attachMethods,
        });
      }

      return this.model;
    },

    checkModelExist: () => {
      if (!this.model) throw new Error('Model not exist!');
    },

    clearSchema: function(keys = []) {
      if (!this.schema) throw new Error('Schema not set!');
      const cleanSchema = {};

      for (let key in this.schema) {
        const cleanValue = { ...this.schema[key] };

        keys.forEach((k) => {
          delete cleanValue[k];
        });
        cleanSchema[key] = cleanValue;
      }

      return cleanSchema;
    },

    create: async function(payload = {}) {
      this.checkModelExist();

      const result = await ACTIONS.on('database.create', ({
        model: this.model, payload,
      }));

      return !result ?
        Promise.reject(`Error create instance of ${this.name}`) :
        result;
    },

  };
};
