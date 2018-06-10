const server = require('http').createServer();
const io = require('socket.io')(server);

// connect module configurations
const moduleConfig = require('./config.json');

module.exports = ({ ACTIONS, ROUTER, utils, show }) => {
   /**
    ********************************
    * Connect ws events to modules *
    ********************************
    */
  ACTIONS.on('websockets.events', () => {
    const events = ROUTER.get('events');
    const sortedEvents = utils.groupByKey('namespace', Object.values(events));

    Object.keys(sortedEvents)
      .forEach((nsp) => {
        sortedEvents[nsp].forEach((event) => {
          io.of(nsp).on('connection', (socket) => {
            socket.on(event.name, ({ data }) => {
              ACTIONS.send(_event.replace('_', '.'), { io, socket, data })
              .then((_data) => socket.emit(_data.event, _data.body))
              .catch((error) => next(error));
            });

            socket.on('disconnect', () =>
              ACTIONS.send(`ws.disconnect.${nsp}`, { io, socket, data })
                .then((_data) => socket.emit(_data.event, _data.body))
                .catch((error) => next(error)));
          });
        });
      });
  });

   /**
    *******************************************
    * Start websockets server and listen port *
    *******************************************
    */
  ACTIONS.on('websockets.start.server', () => {
    const port = moduleConfig.port || 8080;

    server.listen(port, () =>
      show.log(`Sockets running at :${port} port`));

    return Promise.resolve();
  });

  /**
   ************************************************************
   * Stop and clear hardly accessible events, ex: listen port *
   ************************************************************
   */
  ACTIONS.on('clear.websockets', () => server.close());
};
