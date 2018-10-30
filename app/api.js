'use strict';

const RateLimit = require('express-rate-limit');

const serverConfig = require('./config');
const routing = require('./routing');

const { checkSchema, validationResult } = require('express-validator/check');

class APIError {
	constructor(code, message, body) {
		this.statusCode = code;
		this.statusMessage = message;
		this.body = body;
	}
}

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

const modifiers = [];

// --- //

const rateLimitMiddleware = config => {
	if (config.handler)
		config.handler = config.handler.bind(config)
	new RateLimit(config)
};

modifiers.push(config => (serverConfig.use_rate_limiter && config.rateLimit && rateLimitMiddleware(config.rateLimit)));

// --- //

const levels = {
	'guest': () => true,
	'user': req => ('user_id' in req.session),
	'admin': req => req.session.admin,
	'logged': req => ('user_id' in req.session)
};

const levelMiddleware = (level = 'user') => (req, res, next) =>
	Promise.resolve(levels[level] ? levels[level](req) : true)
		.then(x => (x ? next() : reply(res, 401, 'Unauthorized')))
		.catch(err => next(err));

modifiers.push(config => ((!config.level || levels[config.level]) && levelMiddleware(config.level)));

// --- //

const levelsValidation = {
	'logged': req => req.session.user_id === req.params.id
};

const levelValidationMiddleware = (level = 'user') => (req, res, next) =>
	Promise.resolve(levelsValidation[level] ? levelsValidation[level](req) : true)
		.then(x => (x ? next() : reply(res, 401, 'Unauthorized')))
		.catch(err => next(err));

// --- //

const pagination = config => (config.validation = Object.assign(config.validation || {}, {
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
			errorMessage: `per_page must be in range 0 - ${config.pagination.max}`,
			options: value => (value > 0 && value <= config.pagination.max)
		}
	}
}));

const paginationMiddleware = pagination => (req, res, next) => {
	req.locals.limit = (req.query.per_page || (pagination.default || pagination.max));
	req.locals.offset = (req.query.per_page || (pagination.default || pagination.max)) * ((req.query.page || 1) - 1);
	next();
};

modifiers.push(config => ((config.pagination > 0) && pagination(config)));

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

modifiers.push(config => ((config.validation) && validationMiddleware(config.validation)));

modifiers.push(config => ((levelsValidation[config.level]) && levelValidationMiddleware(config.level)));
modifiers.push(config => (config.pagination > 0) && paginationMiddleware(config.pagination));

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

modifiers.push(config => (config.format ?
	formatMiddleware(config.format, apiWrapper(config.code, config.message, config.action)) :
	apiWrapper(config.code, config.message, config.action)
));

// --- //

const apiRouting = config => {
	(config instanceof Function) && (config = { action: config });
	return [
		...(config.require ? (Array.isArray(config.require) ? config.require : [ config.require ]) : []),
		...(modifiers.map(x => x(config)).filter(x => (x instanceof Function)))
	];
};

module.exports = {
	APIError,
	api: routing(apiRouting),
	apiRouting,
	reply,
};