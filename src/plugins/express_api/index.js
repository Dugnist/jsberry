const CONFIG = require('config');
const http = require('http');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const bodyParser = require('body-parser');

// connect module configurations
const moduleConfig = require('./config.json');

// create application instance
const app = express();
const server = http.createServer(app);

// configure default options
const corsOptions = {};

module.exports = ({ ACTIONS, ROUTER }) => {

  /**
   * Access headers
   *
   * @param {Object} moduleConfig - config for express application
   * @param {Object} origin - access to server from external resources
   * @param {Object} headers - http headers ex: [content-type, auth]
   * @param {Object} methods - RESTfull methods ex: [get. post...]
   */

  ACTIONS.on('api.access.headers', () => {

    // ToDo: Nginx configuration for access headers!

    const { origin, headers, methods} = moduleConfig;

    corsOptions.origin = origin;
    corsOptions.allowedHeaders = headers;
    corsOptions.methods = methods;

  });

  /**
   * Configure middleware plugins
   */

  ACTIONS.on('api.configure', () => {

    const serverPath = path.dirname(require.main.filename);

    // ToDo: Nginx configuration for limit connections!
    app.use(helmet());
    app.use(cors(corsOptions));
    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
    app.use(express.static(path.join(serverPath, '../public')));
    // set static path
    app.get('/', (req, res) => {

      res.sendFile(path.join(serverPath, '../public'));

    });

  });

  /**
   * Configure middleware plugins
   */
  ACTIONS.on('api.middlewares', () => {

    const allMiddlewares = ROUTER.get('middlewares');

    for (let _mw in allMiddlewares) {

      app.use(allMiddlewares[_mw]);

    }

  });

  /**
   * Connect api routing to modules
   */

  ACTIONS.on('api.routes', () => {

    const allRoutes = ROUTER.get('routes');

    for (let _route in allRoutes) {

      const route = allRoutes[_route];

      app[route.method](`/${route.path}`, (req, res, next) => {

        const { headers, query, body } = req;
        const props = { headers, query, body };

        ACTIONS.send(_route.replace('_', '.'), props)
          .then((data) => res.send(data))
          .catch((error) => next(error));

      });

    }

  });

  /**
   * Create server and listen port
   */

  ACTIONS.on('api.create.server', () => {

    const name = CONFIG.name || 'Example';
    const port = moduleConfig.port || 8080;

    server.listen(port, () => {

      console.log(`${name} ----- API running at :${port} port`);

    });

    return Promise.resolve();

  });

  /**
   * Stop and clear hardly accessible events, ex: listen port
   */

  ACTIONS.on('clear.api', () => {

    server.close();

  });

};
