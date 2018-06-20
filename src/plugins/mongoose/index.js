const mongoose = require('mongoose');
const { credentials } = require('./config.json');

module.exports = ({ ACTIONS, ROUTER, utils, show }) => {
  /**
   * Connect to database
   * @type {Object}
   */
  mongoose.connect(credentials.databaseUri,
    (err) => show.log((!err) ? 'App connect to ModgoDB' : err)
  );

  ACTIONS.on('database.model.create', ({ name, schema = {} }) => {
      if (!name) return Promise.reject('Empty sequelize schema name!');
      const model = mongoose.model(name, schema);

      return Promise.resolve(model);
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
  ACTIONS.on('database.create', ({ model, payload = {} }) =>{
    const response = utils.promisify(model.create.bind(model));

    return response(payload);
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
    const response = utils.promisify(model.count.bind(model));

    return response(payload).then((count) => count.toString());
  });


  /**
   *************************************
   * SUBSCRIBE TO READ DATABASE ENTITY *
   *************************************
   *
   * @param  {object} model - entity model
   * @param  {object} payload - entity data
   * @return {promise} - success response or error
   */
  ACTIONS.on('database.read', ({ model, payload = {} }) => {
    const response = utils.promisify(model.findOne.bind(model));

    return response(payload);
  });

  /**
   *******************************************
   * SUBSCRIBE TO READ ALL DATABASE ENTITIES *
   *******************************************
   *
   * @param  {object} model - entity model
   * @param  {object} payload - entity data
   * @return {promise} - success response or error
   */
  ACTIONS.on('database.readAll', ({ model, payload = {} }) => {
    const response = utils.promisify(model.find.bind(model));

    return response(payload);
  });

  /**
   ***************************************
   * SUBSCRIBE TO UPDATE DATABASE ENTITY *
   ***************************************
   *
   * @param  {object} model - entity model
   * @param  {object} payload - entity data
   * @return {promise} - success response or error
   */
  ACTIONS.on('database.update', ({ model, payload = {} }) => {
    const response = utils.promisify(model.findOneAndUpdate.bind(model));

    return response({ id: payload.id }, payload, { new: true });
  });

  /**
   ***************************************
   * SUBSCRIBE TO DELETE DATABASE ENTITY *
   ***************************************
   *
   * @param  {object} model - entity model
   * @param  {object} payload - entity data
   * @return {promise} - success response or error
   */
  ACTIONS.on('database.delete', ({ model, payload = {} }) => {
    const response = utils.promisify(model.remove.bind(model));

    return response(payload); // Example: { id: 1 }
  });
};
