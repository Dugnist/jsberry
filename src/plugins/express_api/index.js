const CONFIG = require('config');
const http = require('http');
const path = require('path');
const hpp = require('hpp');
const cors = require('cors');
const csrf = require('csurf');
const helmet = require('helmet');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const RateLimit = require('express-rate-limit');

// connect module configurations
const moduleConfig = require('./config.json');

// create application instance
const app = express();
const server = http.createServer(app);

// configure default options
const corsOptions = {};
const limiter = new RateLimit({
  windowMs: 15*60*1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  delayMs: 0, // disable delaying - full speed until the max limit is reached
});

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

    app.use(limiter); // app.use('/api/', limiter);
    // ToDo: Nginx configuration for limit connections!
    app.use(helmet());
    app.use(cors(corsOptions));
    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
    app.use(hpp()); // app.get('/url', hpp({ whitelist: [ 'key' ] }));
    app.use(cookieParser());
    app.use(session({
      secret: 'h2b5K43c8Afs3u9rg5d6a6',
      resave: false,
      saveUninitialized: true,
      cookie: {},
    }));
    app.use(csrf()); // res.render('send', { csrfToken: req.csrfToken() })
    app.use(express.static(path.join(serverPath, '../public')));
    // set static path
    app.get('/', (req, res) => {

      res.sendFile(path.join(serverPath, '../public'));

    });

  });

  /**
   * Connect api routing to modules
   */

  ACTIONS.on('api.routes', () => {

    for (let _route in ROUTER.routes) {

      const route = ROUTER.routes[_route];

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
