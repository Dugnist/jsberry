const http = require('http');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);

module.exports = ({ ACTIONS, ROUTES }) => {

  ACTIONS.on('api.access.headers', (payload) => {

    app.all('/*', (req, res, next) => {

      res.header('Access-Control-Allow-Origin', payload.origin);
      res.header('Access-Control-Allow-Headers', payload.headers);
      res.header('Access-Control-Allow-Methods', payload.methods);

      next();

    });

  });

  ACTIONS.on('api.configure', (payload) => {

    const serverPath = path.dirname(require.main.filename);

    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use(express.static(path.join(serverPath, '../../public')));

    app.get('/', (req, res) => {

      res.sendFile(path.join(serverPath, '../../public'));

    });

  });

  ACTIONS.on('api.routes', (payload) => {

    for (let _route in ROUTES) {

      const route = ROUTES[_route];

      app[route.method](`/${route.path}`, (req, res, next) => {

        const props = { headers: req.headers, data: req.query, body: req.body };

        ACTIONS.send(_route.replace('_', '.'), props)
          .then((data) => res.send(data))
          .catch((error) => next(error));

      });

    }

  });

  ACTIONS.on('api.create.server', (payload) => {

    server.listen(payload.port, () => {

      console.log(`${payload.name} ----- API running at :${payload.port} port`);

    });

  });

  // Some magic for clean unstoppable functions (for ex. listen port)

  ACTIONS.on('clear.api', () => {

    server.close();

  });

};
