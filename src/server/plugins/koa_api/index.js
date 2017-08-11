const path = require('path');
const Koa = require('koa');
const CSRF = require('koa-csrf');
const cors = require('koa-cors');
const serve = require('koa-static');
const helmet = require('koa-helmet');
const router = require('koa-router')();
const convert = require('koa-convert');
const bodyParser = require('koa-bodyparser');
const ratelimit = require('koa-ratelimit-lru')
const methodOverride = require('koa-methodoverride');

const app = new Koa();
const corsOptions = {};
const ratelimitOptions = {
  duration: 15*60*1000,
  rate: 100,
  id (ctx) {
    return ctx.ip
  },
  headers: {
    remaining: 'Rate-Limit-Remaining',
    reset: 'Rate-Limit-Reset',
    total: 'Rate-Limit-Total'
  },
  errorMessage: 'Sometimes You Just Have to Slow Down.'
};

module.exports = ({ ACTIONS, ROUTER }) => {

  /**
   * Access headers
   *
   * @param {Object} options - config for express application
   * @param {Object} req - express request object
   * @param {Object} res - express response object
   * @param {function()} next callback
   */

  ACTIONS.on('api.access.headers', (options) => {

    corsOptions.origin = options.origin;
    corsOptions.headers = options.headers;
    corsOptions.methods = options.methods;

  });

  ACTIONS.on('api.configure', () => {

    const serverPath = path.dirname(require.main.filename);

    app.use(ratelimit(ratelimitOptions));
    app.use(convert(cors(corsOptions)));
    app.use(helmet());
    // ToDo: HPP
    app.use(bodyParser({ jsonLimit: '10mb', formLimit: '10mb' }));
    app.use(serve(path.join(serverPath, '../../public')));
    app.use(methodOverride((req, _res) => {
      if (req.body && (typeof req.body === 'object') && ('_method' in req.body)) {
        // look in urlencoded POST bodies and delete it
        const method = req.body._method;
        delete req.body._method;
        return method;
      }
    }));

    app.use(new CSRF({
      invalidSessionSecretMessage: 'Invalid session secret',
      invalidSessionSecretStatusCode: 403,
      invalidTokenMessage: 'Invalid CSRF token',
      invalidTokenStatusCode: 403,
      excludedMethods: [ 'GET', 'HEAD', 'OPTIONS' ],
      disableQuery: false
    })); // ctx.body = ctx.csrf;

    app.use(router.routes()).use(router.allowedMethods());

  });

  ACTIONS.on('api.routes', () => {

    for (let _route in ROUTER.routes) {

      const route = ROUTER.routes[_route];

      router[route.method](`/${route.path}`, (ctx, _next) => {

        const { headers, query, body } = ctx.request;
        const props = { headers, data: query, body };

        ACTIONS.send(_route.replace('_', '.'), props)
          .then((data) => ctx.body = data)
          .catch((error) => _next(error));

      });

    }

  });

  ACTIONS.on('api.create.server', (options) => {

    app.listen(options.port, () => {

      console.log(`${options.name} ----- API running at :${options.port} port`);

    });

    return Promise.resolve();

  });

  // Some magic for clean unstoppable functions (for ex. listen port)

  ACTIONS.on('clear.api', () => {

    // ToDo app.close();

  });

};
