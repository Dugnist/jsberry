const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const { credentials } = require('./config.json');

mongoose.set('useFindAndModify', false);
mongoose.Promise = global.Promise;

module.exports = ({ ACTIONS, show }) => {
  /**
   * Connect to database
   * @type {Object}
   */
  mongoose.connect(credentials.databaseUri, { useNewUrlParser: true },
    (err) => show.log((!err) ? 'App connect to ModgoDB' : err)
  );

  /**
   *****************************************
   * SUBSCRIBE TO CREATE MODEL FROM SCHEMA *
   *****************************************
   *
   * @param  {object} model - entity model
   * @param  {object} schema - entity schema
   * @param  {function} attachMethods - model methods
   * @return {promise} - success response or error
   */
  ACTIONS.on('database.model.create', ({ name, schema={}, statics }) => {
      if (!name) return Promise.reject('Empty mongoose schema name!');

      let essenseSchema = new mongoose.Schema(schema);

      essenseSchema.plugin(mongoosePaginate);

      if (statics) essenseSchema = statics(essenseSchema);

      const model = mongoose.model(name, essenseSchema);

      return Promise.resolve(model);
  });

  /**
   *******************************
   * SUBSCRIBE TO CHECK DATABASE *
   *******************************
   */
  ACTIONS.on('database.check', () => Promise.resolve(true));

  /**
   ****************************************
   * SUBSCRIBE TO COUNT DATABASE ENTITIES *
   ****************************************
   *
   * @param  {object} model - entity model
   * @param  {object} payload - entity data
   * @return {promise} - success response or error
   */
  ACTIONS.on('database.count', ({ model, payload = {} }) => {
    const operation = model.count.bind(model);

    return operation(payload).then((count) => count.toString());
  });

  /**
   ***************************************
   * SUBSCRIBE TO CREATE DATABASE ENTITY *
   ***************************************
   *
   * @param  {object} model - entity model
   * @param  {object} payload - entity data
   * @return {promise} - success response or error
   */
  ACTIONS.on('database.create', ({ model, payload = {} }) =>
    model.create.bind(model)(payload)
  );

  /**
   *************************************
   * SUBSCRIBE TO READ DATABASE ENTITY *
   *************************************
   *
   * @param  {object} model - entity model
   * @param  {object} payload - entity data
   * @return {promise} - success response or error
   */
  ACTIONS.on('database.read', ({ model, payload = {} }) =>
      model.findOne.bind(model)(payload)
  );

  /**
   *******************************************
   * SUBSCRIBE TO READ ALL DATABASE ENTITIES *
   *******************************************
   *
   * @param  {object} model - entity model
   * @param  {object} payload - entity data
   * @return {promise} - success response or error
   */
  ACTIONS.on('database.readAll', ({ model, payload = {} }) =>
    model.find.bind(model)(payload)
  );

  /**
   *******************************************
   * SUBSCRIBE TO PAGINATE DATABASE ENTITIES *
   *******************************************
   *
   * @param  {object} model - entity model
   * @param  {object} payload - entity data
   * @return {promise} - success response or error
   */
  ACTIONS.on('database.paginate', ({ model, payload = {},
    options = { page: 1, limit: 10 } }) =>
      model.paginate.bind(model)(payload, options)
  );

  /**
   ***************************************
   * SUBSCRIBE TO UPDATE DATABASE ENTITY *
   ***************************************
   *
   * @param  {object} model - entity model
   * @param  {object} payload - entity data
   * @return {promise} - success response or error
   */
  ACTIONS.on('database.update', ({ model, payload = {} }) =>
    model.findOneAndUpdate.bind(model)(payload)
  );

  /**
   ***************************************
   * SUBSCRIBE TO DELETE DATABASE ENTITY *
   ***************************************
   *
   * @param  {object} model - entity model
   * @param  {object} payload - entity data
   * @return {promise} - success response or error
   */
  ACTIONS.on('database.delete.one', ({ model, payload = {} }) =>
    model.deleteOne.bind(model)(payload) // Example: { id: 1 }
  );

  /**
   *****************************************
   * SUBSCRIBE TO DELETE DATABASE ENTITIES *
   *****************************************
   *
   * @param  {object} model - entity model
   * @param  {object} payload - entity data
   * @return {promise} - success response or error
   */
  ACTIONS.on('database.delete.many', ({ model, payload = {} }) =>
    model.deleteMany.bind(model)(payload) // Example: { id: 1 }
  );
};
