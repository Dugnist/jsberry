# <p align="center"><a href='https://github.com/Dugnist/jsberry'><img src='public/jsberry.png' height='90' alt='JSBerry Logo' aria-label='JSBerry' /></a><br/> JSBerry </p>

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/Dugnist/jsberry/issues)
[![HitCount](http://hits.dwyl.io/JSBerry/https://github.com/Dugnist/jsberry.svg)](http://hits.dwyl.io/JSBerry/https://github.com/Dugnist/jsberry)
[![Dependency Status](https://img.shields.io/bithound/dependencies/github/rexxars/sse-channel.svg)]()

Open-source modular simple architecture for Node.js.

## Quick start

```bash
git clone https://github.com/Dugnist/jsberry
npm i
```

Run this scripts to install your framework {express||koa} modules:
```bash
npm run express||koa
```

Also edit `config/default.json`
set key `"framework"` to your framework {express||koa} name:

```bash
npm start
```

## Scripts

- `npm start` - run application with development mode
- `npm run prod` - run application with production mode
- `npm run inspect` - run application with node debugger
- `npm run check` - run npm modules vulnerabilities checker (`npm i nsp -g`)
- `npm run protect`- run npm modules vulnerabilities checker (`npm i snyk -g`)
- `npm run express`- install dependencies for express module
- `npm run koa`- install dependencies for koa module

## Debugger

Run `npm run inspect` and open this url in browser:

```bash
chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:9229/${uuid}
```

where "uuid" - debug session id from console.

## Author

**Dugnist Alexey**

- <http://github.com/Dugnist>
- <https://www.facebook.com/Dugnist>



## Copyright and license

Code and documentation copyright 2017 JsBerry. Code released under [the MIT license](LICENSE).
