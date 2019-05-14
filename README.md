# <p align="center"><a href='https://github.com/Dugnist/jsberry'><img src='https://raw.githubusercontent.com/Dugnist/jsberry/master/packages/assets/jsberry.png' height='90' alt='JSBerry Logo' aria-label='JSBerry' /></a><br/> JSBerry </p>

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/Dugnist/jsberry/pulls)
[![GitHub last commit](https://img.shields.io/github/last-commit/Dugnist/jsberry.svg)](https://github.com/Dugnist/jsberry/commits/master)
[![HitCount](http://hits.dwyl.io/JSBerry/https://github.com/Dugnist/jsberry.svg)](https://github.com/Dugnist/jsberry)
[![GitHub issues](https://img.shields.io/github/issues/Dugnist/jsberry.svg)](https://github.com/Dugnist/jsberry/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/Dugnist/jsberry.svg)](https://github.com/Dugnist/jsberry/pulls)
[![GitHub release](https://img.shields.io/github/release/Dugnist/jsberry.svg)](https://github.com/Dugnist/jsberry/releases)
[![license](https://img.shields.io/github/license/Dugnist/jsberry.svg)](https://github.com/Dugnist/jsberry/blob/master/LICENSE)

JSBerry is open source modular simple architecture for building Node.js applications.

JSBerry is not a framework. It's a solution for creating applications using any frameworks, modules, and plugins.

**IMPORTANT NOTE:** JSBerry isn't yet ready for production, stay tuned for releases, beta version will come soon. You can see what we're working on [here](https://github.com/Dugnist/jsberry-core) and our [ROADMAP](https://github.com/Dugnist/jsberry/blob/master/ROADMAP.md).

## <a href="https://willogix.gitbook.io/jsberry">Documentation</a>

- <a href="https://github.com/Dugnist/jsberry-koa-api">Koa API plugin</a>
- <a href="https://github.com/Dugnist/jsberry-restify-api">Restify API plugin</a>

<a href="https://github.com/Dugnist/jsberry/blob/master/STORE.md">Modules and plugins store</a>

<p align="center"><img src='https://raw.githubusercontent.com/Dugnist/jsberry/master/packages/assets/howtocorework.png' width='600' alt='How to core work' /></p>

## Quick start

```bash
npm i -g jsberry@latest
```

Create new project:

```bash
  jsberry new my-project
  cd my-project
  npm start
```

<a href="https://github.com/Dugnist/jsberry/blob/master/STORE.md">Modules and plugins store</a>.

## How to use

After installing you can create any your own module in "src/modules" directory or any your own plugin in "src/plugins" directory.
For example, we can create a plugin for making outside requests from the server using the npm module "request".

- Install node module "request-promise" using `npm i request-promise`.
- Create a directory "request" in "src/plugins".
- Create file "index.js" in "request" directory.
- Paste this code to "index.js" for create plugin wrapper.

```
  const request = require('request-promise');

  module.exports = ({ ACTIONS }) => {
    // plugin code...
  });
```

- Create an ACTION which will send outside request. Paste this code instead "// plugin code..."

```
  ACTIONS.on('request.send', ({ url = 'http://www.google.com' }) => {
    return request(url);
  });
```

After that, you need to connect your module/plugin to application "core":

- Go to "src/plugins/index.js".
- Add this line to top: `const Request = require('./request');`
- Add your plugin variable Request to array "PLUGINS".

Now, you can call `ACTION.send('request.send', { url: 'example.com' });` from any other module/plugin and it will return promised site response.


## List Of Scripts

- `npm start` - run application with development mode
- `npm run prod` - run application with production mode
- `npm run inspect` - run application with node debugger (dev mode)
- `npm run check` - run npm modules vulnerabilities checker (`npm i nsp -g`)
- `npm run protect`- run npm modules vulnerabilities checker (`npm i snyk -g`)

## Docker

Add yourself to the docker group to enable running docker commands
without prefixing with `sudo`:

```bash
  sudo groupadd docker
  sudo chown root:docker /var/run/docker.sock
  sudo chown `$USER`:docker /home/`$USER`/.docker/config.json
  sudo usermod -a -G docker $USER
  reboot
```

To build simple Docker jsberry image:

```bash
  docker build -t `$USER`/jsberry .
```

To run build:
```bash
  docker run -p 8080:8000 -d `$USER`/jsberry
```

To restart container automatically:

```bash
  docker run -dit --restart unless-stopped `$USER`/jsberry
```

To remove unused (none:none) images use:

```bash
  docker rmi $(sudo docker images -f "dangling=true" -q)
```

## Debugger

Run `npm run inspect` and open this url in browser:

```bash
chrome-devtools://devtools/bundled/inspector.html?experiments=true&v8only=true&ws=127.0.0.1:9229/${uuid}
```

where "uuid" - debug session id from the console.

OR:

Install extension <a href='https://chrome.google.com/webstore/detail/nodejs-v8-inspector/lfnddfpljnhbneopljflpombpnkfhggl'>nodejs-v8-inspector</a> and launch it on 9229 port.

## What's new?

You can check our <a href="https://github.com/Dugnist/jsberry/blob/master/ROADMAP.md" target="_blank">ROADMAP</a> and propose new features.

## Community support

For general help using JSBerry, please refer to the official <a href="https://dugnist.gitbooks.io/jsberry" target="_blank">documentation</a>. For additional help, you can use ask question here:

  - <a href="https://t.me/joinchat/Ell7tkiTmlo8WvGgRu2aoA">Telegram</a> (realtime support)
  
## CONTRIBUTORS

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

| [<img src="https://avatars2.githubusercontent.com/u/6489460?s=460&v=4" width="100px;"/><br /><sub><b>Alexey Dugnist</b></sub>](https://github.com/Dugnist) | [<img src="https://avatars1.githubusercontent.com/u/35298029?s=460&v=4" width="100px;"/><br /><sub><b>Sergey Rudenko</b></sub>](https://github.com/sergeyrudenko) |
| ------------- | ------------- |
| [💡](#help "Evangelist") [💻](https://github.com/Dugnist/jsberry/commits/master "Code") [❏](https://github.com/Dugnist/jsberry/blob/master/STORE.md "Plugins") [📖](https://dugnist.gitbooks.io/jsberry "Documentation") [💬](https://t.me/joinchat/Ell7tkiTmlo8WvGgRu2aoA "Answering Questions")  | [💻](https://github.com/Dugnist/jsberry/commits/master "Code") [❏](https://github.com/Dugnist/jsberry/blob/master/STORE.md "Plugins") [📖](https://dugnist.gitbooks.io/jsberry "Documentation") [💬](https://t.me/joinchat/Ell7tkiTmlo8WvGgRu2aoA "Answering Questions")  |

<!-- ALL-CONTRIBUTORS-LIST:END -->

## Author

**Dugnist Alexey**

- <https://www.linkedin.com/in/Dugnist>
- <http://github.com/Dugnist>


## Copyright and license

Code and documentation copyright 2017-2018 JSBerry. Code released under [the MIT license](LICENSE).
