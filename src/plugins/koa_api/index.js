const CONFIG = require('config');
const path = require('path');
const Koa = require('koa');
const cors = require('koa-cors');
const serve = require('koa-static');
const helmet = require('koa-helmet');
const router = require('koa-router')();
const convert = require('koa-convert');
const compress = require('koa-compress');
const bodyParser = require('koa-bodyparser');
const methodOverride = require('koa-methodoverride');

// connect module configurations
const moduleConfig = require('./config.json');

// create application instance
const app = new Koa();

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

  ACTIONS.on('api.access.headers', (options) => {
    // ToDo: Nginx configuration for access headers!

    const { origin, headers, methods} = moduleConfig;

    corsOptions.origin = origin;
    corsOptions.headers = headers;
    corsOptions.methods = methods;
  });

  /**
   * Configure middleware plugins
   */

  ACTIONS.on('api.configure', () => {
    const serverPath = path.dirname(require.main.filename);

    // ToDo: Nginx configuration for limit connections!
    app.use(convert(cors(corsOptions)));
    app.use(helmet());
    app.use(compress());
    app.use(bodyParser({ jsonLimit: '10mb', formLimit: '10mb' }));
    app.use(serve(path.join(serverPath, '../public')));
    app.use(methodOverride((req, _res) => {
    if (req.body && (typeof req.body === 'object') && ('_method' in req.body)) {
      const method = req.body._method;
      delete req.body._method;
      return method;
    }
    }));

    app.use(router.routes()).use(router.allowedMethods());
  });

  /**
   * Connect api routing to modules
   */

  ACTIONS.on('api.routes', () => {
    for (let _route in ROUTER.routes) {
      const route = ROUTER.routes[_route];

      router[route.method](`/${route.path}`, (ctx, _next) => {
        const { headers, query, body } = ctx.request;
        const props = { headers, query, body };

        ACTIONS.send(_route.replace('_', '.'), props)
          .then((data) => ctx.body = data)
          .catch((error) => _next(error));
      });
    }
  });

  /**
   * Create server and listen port
   */

  ACTIONS.on('api.create.server', () => {
    const name = CONFIG.name || 'Example';
    const port = moduleConfig.port || 8080;

    app.listen(port, () => {
      console.log(`${name} ----- API running at :${port} port`);
    });

    return Promise.resolve();
  });

  /**
   * Stop and clear hardly accessible events, ex: listen port
   */

  ACTIONS.on('clear.api', () => {
    // ToDo app.close();
  });
};
