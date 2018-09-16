'use strict';

const methods = {
	"GET": 'get',
	"POST": 'post',
	"PUT": 'put',
	"PATCH": 'patch',
	"DELETE": 'delete',
};

module.exports = (globalConfig = {}) => {
	if (globalConfig instanceof Function)
		globalConfig = { modifiers: [ globalConfig ] };
	else if (Array.isArray(globalConfig))
		globalConfig = { modifiers: globalConfig };
	globalConfig.router || (globalConfig.router = require('express').Router);
	globalConfig.modifiers || (globalConfig.modifiers = []);
	Array.isArray(globalConfig.modifiers) || (globalConfig.modifiers = [ globalConfig.modifiers ]);
	let build;
	build = (config, parent) => {
		if (config instanceof Function)
			return config.bind(parent);
		else if (Array.isArray(config))
			return config.map(x => build(x, parent));
		const router = globalConfig.router();
		const herited = Object.assign({}, parent || {}, config);
		const keys = Object.keys(herited);
		const childConfig = {}, routes = {
			nodes: [],
			methods: [],
			middlewares: [],
		};
		for (let k of keys)
			if (k.slice(0, 1) === '/')
				routes.nodes.push({ path: k, method: 'use', config: herited[k] });
			else if (methods[k])
				routes.methods.push({ path: '/', method: methods[k], config: herited[k] });
			else if (k === 'handlers')
				routes.middlewares.push({ method: 'use', config: herited.handlers });
			else
				childConfig[k] = herited[k];
		globalConfig.modifiers.forEach(x =>
			routes.middlewares.push.apply(routes.middlewares,
				(x(childConfig) || [])
				.map(x => ({ method: 'use', config: x }))
			)
		);
		const add = route => route.path ?
			router[route.method](route.path, build(route.config, childConfig)) :
			router[route.method](build(route.config, childConfig));
		// const add = route => {
		// 	console.log(route.method + " - " + (route.path || ''));
		// 	return route.path ?
		// 	router[route.method](route.path, build(route.config, childConfig)) :
		// 	router[route.method](build(route.config, childConfig))
		// };
		routes.nodes.forEach(x => add(x));
		routes.methods.forEach(x => add(x));
		routes.middlewares.forEach(x => add(x));
		return router;
	};
	return build;
};