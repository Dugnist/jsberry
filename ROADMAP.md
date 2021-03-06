# JSBerry Roadmap

***This is a living document, it describes what features we should implement in priority.***

This document could be influenced by the community feedback, security issues, stability, future needs, etc.

<a href="https://favro.com/organization/9039a67d00a837f22b655a13/e10dfa4c8d6be999b74f9301">Live task management</a>

### alpha

**Note:** We will publish this version to allow the community to test and contribute it and give us feedback.

`jsberry@alpha.0.1`
* ~~Create Modules/Plugin manager, load balancer, logger.~~
* ~~Mediator with ACTIONS.~~
* ~~ROUTER with routes and middlewares support.~~
* ~~Add "express" REST plugin.~~
* ~~Add <a href="https://github.com/Dugnist/jsberry/blob/master/STORE.md">"mongoose" plugin</a>.~~
* ~~Vulnerabilities checkers: "nsp" and "snyk".~~
* ~~Update middlewares, add layers.~~
* ~~Add <a href="https://github.com/Dugnist/jsberry/blob/master/STORE.md">"koa" REST plugin</a>.~~
* ~~Add <a href="https://github.com/Dugnist/jsberry/blob/master/STORE.md">"twillio" sms plugin</a>.~~
* ~~v8 debug inspector.~~

`jsberry@alpha.0.2`
* ~~Add "sendmail" plugin, connect to system notifications~~.
* ~~Add "graphql" plugin~~.
* ~~Add husky, lint staged to check errors at precommit~~.
* ~~Authorization middleware~~.
* ~~Add "websockets" plugin~~.
* ~~Add <a href="https://github.com/Dugnist/jsberry/blob/master/STORE.md">"restify" REST plugin</a>.~~
* ~~Overwritten default logger, added "facade" abstraction to use any loggers.~~
* ~~Validation middleware using "Joi" | add plugin.~~
* Permission middleware.
* Error handler module.
* Add "sequelize" plugin [STORE].
* Rewrite authorization middleware -> add "passport" plugin.
* Rewrite "sendmail" to "nodemailer" plugin.
* Add "nginx" and ~~"docker"~~ config.

`jsberry@alpha.0.3 (Main planned changes in future)`
* Add "telegram bot" plugin [STORE].
* Add "blockchain.info" plugin [STORE].
* Add Sheduler to core.
* Add Registry to core.
* Add Cache plugin (Redis) [STORE].
* Migrations (Backup).
* Test coverage.
