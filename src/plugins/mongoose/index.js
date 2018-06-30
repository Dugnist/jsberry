const mongoose = require('mongoose');
const { credentials } = require('./config.json');

module.exports = ({ ACTIONS, ROUTER, show }) => {
  /**
   * Connect to database
   * @type {Object}
   */
  mongoose.connect(credentials.databaseUri,
    (err) => show.log((!err) ? 'App connect to ModgoDB' : err)
  );

  ACTIONS.on('database.model.create', ({ name, schema={}, attachMethods }) => {
      if (!name) return Promise.reject('Empty sequelize schema name!');

      let essenseSchema = new mongoose.Schema(schema);

      if (attachMethods) essenseSchema = attachMethods(essenseSchema);

      const model = mongoose.model(name, essenseSchema);

      return Promise.resolve(model);
  });

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
  ACTIONS.on('database.delete', ({ model, payload = {} }) =>
    model.remove.bind(model)(payload) // Example: { id: 1 }
  );
};
