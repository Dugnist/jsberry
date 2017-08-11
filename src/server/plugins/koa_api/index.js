const path = require('path');
const Koa = require('koa');
const cors = require('koa-cors');
const serve = require('koa-static');
const helmet = require('koa-helmet');
const router = require('koa-router')();
const convert = require('koa-convert');
const bodyParser = require('koa-bodyparser');
const methodOverride = require('koa-methodoverride');

const app = new Koa();
const corsOptions = {};

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

    app.use(convert(cors(corsOptions)));
    app.use(helmet());
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
