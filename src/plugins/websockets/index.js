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

      for (let _event in ROUTER.events) {

        const event = ROUTER.events[_event];

        client.on(event.name, (data) => {

          const props = { data, client };

          ACTIONS.send(_event.replace('_', '.'), props)
          .then((_data) => res.send(_data))
          .catch((error) => next(error));

        });

      }

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
