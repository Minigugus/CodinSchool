'use strict';

const routing = require('./routing');

const { checkSchema, validationResult } = require('express-validator/check');

const db = require('./db');

const send = (res, code, { message, ...body }) => body ? res.status(code, message).json(body) : res.status(code, message).end();

const ok = (res, body) => send(res, body ? 200 : 204, body);

const _reply = (res, { _code, _message, ...body }) => {
	const bodyEmpty = !body || !Object.keys(body).length;
	res.status(_code || (bodyEmpty ? 204 : 200), _message);
	if (bodyEmpty)
		res.end();
	else
		res.json(body);
};

class APIError {
	constructor(code, message, body) {
		this.statusCode = code;
		this.statusMessage = message;
		this.body = body;
	}
}

const api = config => {
	(config instanceof Function) && (config = { callback: config });
	const defaultResponse = (config.success ? (typeof config.success === 'number' ? { _code: config.success } : config.success) : {});
	const callback = (req, res, next) =>
		Promise.resolve(config.callback(req, res, next))
			.then(x => _reply(res, Object.assign(x.toJSON instanceof Function ? x.toJSON() : x, defaultResponse)))
			.catch(err => ((err instanceof APIError) ?
				_reply(res, { _code: err.statusCode, _message: err.statusMessage, ...err.body }) :
				next(err)));
	const arr = [];
	if (!config.guest)
		arr.push((req, res, next) => (('user_id' in req.session) ? next() : _reply(res, { _code: 401, _message: 'Unauthorized' })));
	if (config.admin)
		arr.push((req, res, next) => (req.session.admin ? next() : _reply(res, { _code: 403 })));
	if (config.per_page_max > 0)
		config.validation = Object.assign(config.validation || {}, {
			page: {
				in: [ 'query' ],
				errorMessage: 'Invalid page number',
				optional: true,
				isInt: true,
				toInt: true,
				custom: {
					errorMessage: 'page must be a positive not null integer.',
					options: value => (value > 0)
				}
			},
			per_page: {
				in: [ 'query' ],
				errorMessage: 'Invalid per_page number',
				optional: true,
				isInt: true,
				toInt: true,
				custom: {
					errorMessage: `per_page must be in range 0 - ${config.per_page_max}`,
					options: value => (value > 0 && value <= config.per_page_max)
				}
			}
		});
	if (config.validation)
	{
		arr.push(checkSchema(config.validation));
		arr.push((req, res, next) => {
			const errors = validationResult(req);
			if (errors.isEmpty())
			{
				if (config.per_page_max > 0)
				{
					req.locals.limit = req.query.per_page;
					req.locals.offset = (req.query.page - 1) * req.locals.limit;
				}
				next();
			}
			else
				_reply(res, { _code: 400, _message: 'Bad Request', errors: errors.array() });
		});
	}
	if (config.callback)
	{
		if (config.format)
			arr.push((req, res, next) => {
				const format = {};
				for (let key of config.format)
					if (key === 'default')
						format[key] = () => next();
					else
						format[key] = () => callback(req, res, next);
				if (!format.default)
					format.default = () => _reply(res, { _code: 406, _message: 'Format not supported' });
				res.format(format);
			});
		else
			arr.push(callback);
	}
	// console.log(arr, config);
	return arr;
};

const reply = (res, ...args) => {
	let code, message, body;
	switch (args.length)
	{
		case 0:
			code = 204;
			break;
		case 1:
			if (typeof args[0] === 'number')
				code = args[0];
			else
				body = args[0];
			break;
		case 2:
			if (typeof args[0] === 'number')
			{
				code = args[0];
				if (typeof args[1] === 'string')
					message = args[1];
				else
					body = args[1];
			}
			else if (typeof args[0] === 'string')
			{
				message = args[0];
				body = args[1];
			}
			else
				body = args[1];
			break;
		default:
			code = args[0];
			message = args[1];
			body = args[2];
			break;
	}
	res.status(code || ((!body || !Object.keys(body).length) ? 204 : 200), message);
	body ? res.json(body) : res.end();
};

// --- //

const apiWrapper = (code, message, cb) => (req, res, next) =>
	Promise.resolve(cb({
			req,
			res,
			next,
			ok: reply.bind(null, res, code, message),
			fail: reply.bind(null, res)
		}))
		.then(x => (!res.headersSent && reply(res, code, message, ((x && x.toJSON instanceof Function) ? x.toJSON() : x))))
		.catch(err => ((!res.headersSent && err instanceof APIError) ?
			reply(res, err.statusCode, err.statusMessage, err.body) :
			next(err)));

// --- //

const levels = {
	'guest': () => true,
	'user': req => ('user_id' in req.session),
	'admin': req => req.session.admin,
	'logged': req => ('user_id' in req.session)
	// 'user': req => (('user_id' in req.session) ? next() : _reply(res, { _code: 401, _message: 'Unauthorized' }))
};

const levelMiddleware = (level = 'user') => (req, res, next) =>
	Promise.resolve(levels[level] ? levels[level](req) : true)
		.then(x => (x ? next() : reply(res, 401, 'Unauthorized')))
		.catch(err => next(err));

// --- //

const levelsValidation = {
	'logged': req => req.session.user_id === req.params.id
};

const levelValidationMiddleware = (level = 'user') => (req, res, next) =>
	Promise.resolve(levelsValidation[level] ? levelsValidation[level](req) : true)
		.then(x => (x ? next() : reply(res, 401, 'Unauthorized')))
		.catch(err => next(err));

// --- //

const pageMiddleware = per_page => (req, res, next) => {
	req.locals.limit = (req.query.per_page || per_page);
	req.locals.offset = (req.query.per_page || per_page) * ((req.query.page || 1) - 1);
	next();
};

// --- //

const validationMiddleware = schema => [
	checkSchema(schema),
	(req, res, next) => {
		const errors = validationResult(req);
		if (errors.isEmpty())
			next();
		else
			reply(res, 400, { errors: errors.array() });
	}
];

// --- //

const formatMiddleware = (format, callback) => (req, res, next) => {
	const _format = {};
	for (let key of format)
		if (key === 'default')
			_format[key] = () => next();
		else
			_format[key] = () => callback(req, res, next);
	if (!_format.default)
		_format.default = () => reply(res, 406, 'Format not supported');
	res.format(_format);
};

// --- //

const apiRouting = config => {
	(config instanceof Function) && (config = { action: config });
	if (!config.action)
		return [];
	(config.require && !Array.isArray(config.require)) && (config.require = [ config.require ]);
	(config.handlers && !Array.isArray(config.handlers)) && (config.handlers = [ config.handlers ]);
	const arr = [
		...(config.require ? (Array.isArray(config.require) ? config.require : [ ...config.require ]) : []),
		...(config.handlers ? (Array.isArray(config.handlers) ? config.handlers : [ ...config.handlers ]) : [])
	];
	arr.push(levelMiddleware(config.level));
	if (config.per_page_max > 0)
		config.validation = Object.assign(config.validation || {}, {
			page: {
				in: [ 'query' ],
				errorMessage: 'Invalid page number',
				optional: true,
				isInt: true,
				toInt: true,
				custom: {
					errorMessage: 'page must be a positive not null integer.',
					options: value => (value > 0)
				}
			},
			per_page: {
				in: [ 'query' ],
				errorMessage: 'Invalid per_page number',
				optional: true,
				isInt: true,
				toInt: true,
				custom: {
					errorMessage: `per_page must be in range 0 - ${config.per_page_max}`,
					options: value => (value > 0 && value <= config.per_page_max)
				}
			}
		});
	if (config.validation)
		arr.push(validationMiddleware(config.validation));
	arr.push(levelValidationMiddleware(config.level));
	if (config.per_page_max > 0)
		arr.push(pageMiddleware(config.per_page || config.per_page_max));
	if (config.action)
		if (config.format)
			arr.push(formatMiddleware(config.format, apiWrapper(config.code, config.message, config.action)));
		else
			arr.push(apiWrapper(config.code, config.message, config.action));
	// console.log(arr, config);
	return arr;
};

module.exports = {
	send,
	ok,
	APIError,
	api: routing(apiRouting),
	apiRouting,
	reply,
};