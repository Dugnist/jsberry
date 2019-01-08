/* eslint-disable require-jsdoc */
let ACTIONS = null;

module.exports = class MODEL {
  //
  static set actions(newActions) {
    ACTIONS = newActions;

    // ACTIONS.on(`postinit.${this.name}111111111111`, ()=>{
    //   this.connectModel();
    // });

    return ACTIONS;
  } 
  //
  constructor(name = null, schema = null) {
    if (!this.name && !this.name) {
      this.setModelName(name);
      this.setSchema(schema);
    } else {
      throw new Error(`Model already have name ${this.name}!`);
    }

    return this;
  }

  get model() {
    return this.model;
  }

  setModelName(name = '') {
    if (!this.name) {
      this.name = name;
    } else {
      throw new Error(`Model already have name ${this.name}!`);
    }

    return this;
  }

  setSchema(schema = {}) {
    if (!this.schema) {
      this.schema = schema;
    } else {
      throw new Error(`Schema already set for ${this.name}!`);
    }

    return this;
  }

  async connectModel() {
    try {
      const checkDB = await ACTIONS.send('database.check');
  
      if (!checkDB) throw new Error('Database plugin not connected!');
      if (!this.name) throw new Error('Model don\'t have any name!');
      if (!this.schema) throw new Error('Model don\'t have any schema!');
      if (!this.model) {
        const cleanSchema = this.clearSchema(['validate']); // clear from keys
  
        console.log(cleanSchema);
  
        this.model = ACTIONS.send('database.model.create', {
          name: this.name, schema: cleanSchema,
          attachMethods: this.attachMethods,
        });
      }
  
      return this.model;
    } catch (error) {
      throw new Error(error);
    }
  }

  checkModelExist() {
    if (!this.model) throw new Error('Model not exist!');
  }

  clearSchema(keys = []) {
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
  }

  async create(payload = {}) {
    this.checkModelExist();

    const result = await ACTIONS.on('database.create', ({
      model: this.model, payload,
    }));

    return !result ?
      Promise.reject(`Error create instance of ${this.name}`) :
      result;
  }
};
