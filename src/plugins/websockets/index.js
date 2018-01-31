/**
 * IN PROGRESS!!!
 */
const CONFIG = require('config');
const server = require('http').createServer();
const io = require('socket.io')(server);

// connect module configurations
const moduleConfig = require('./config.json');

module.exports = ({ ACTIONS, ROUTER }) => {

  /**
   * Send websockets events to modules
   */

  ACTIONS.on('websockets.events', () => {

    io.on('connection', (client) => {

      ROUTER.events.forEach((event) => {

        client.on(event.name, (data) => {

          ACTIONS.send(_event.replace('_', '.'), { data })
          .then((_data) => client.emit(_data.event, _data.body))
          .catch((error) => next(error));

        });

      });

      // client.on('disconnect', () => {}); ToDo!

    });

  });

  /**
   * Start websockets server and listen port
   */

  ACTIONS.on('websockets.start.server', () => {

    const port = moduleConfig.port || 8080;

    server.listen(port);

    return Promise.resolve();

  });

  /**
   * Stop and clear hardly accessible events, ex: listen port
   */

  ACTIONS.on('clear.websockets', () => {

    // server.close(); ToDo

  });

};
