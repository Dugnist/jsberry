# <p align="center"><a href='https://github.com/Dugnist/jsberry'><img src='public/jsberry.png' height='90' alt='JSBerry Logo' aria-label='JSBerry' /></a><br/> JSBerry </p>
  
[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/Dugnist/jsberry/pulls)
[![GitHub last commit](https://img.shields.io/github/last-commit/Dugnist/jsberry.svg)](https://github.com/Dugnist/jsberry/commits/master)
[![HitCount](http://hits.dwyl.io/JSBerry/https://github.com/Dugnist/jsberry.svg)](https://github.com/Dugnist/jsberry)
[![GitHub issues](https://img.shields.io/github/issues/Dugnist/jsberry.svg)](https://github.com/Dugnist/jsberry/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/Dugnist/jsberry.svg)](https://github.com/Dugnist/jsberry/pulls)
[![GitHub release](https://img.shields.io/github/release/Dugnist/jsberry.svg)](https://github.com/Dugnist/jsberry/releases)
[![license](https://img.shields.io/github/license/Dugnist/jsberry.svg)](https://github.com/Dugnist/jsberry/blob/master/LICENSE)

JSBerry is open source modular simple architecture for building Node.js applications.

## Quick start

```bash
git clone https://github.com/Dugnist/jsberry project
cd project
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

Code and documentation copyright 2017-2018 JSBerry. Code released under [the MIT license](LICENSE).
