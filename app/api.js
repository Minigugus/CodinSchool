'use strict';

const { checkSchema, validationResult } = require('express-validator/check');

const db = require('./db');

const send = (res, code, { message, ...body }) => body ? res.status(code, message).json(body) : res.status(code, message).end();

const ok = (res, body) => send(res, body ? 200 : 204, body);

const reply = (res, { _code, _message, ...body }) => {
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
	const callback = (req, res, next) =>
		Promise.resolve(config.callback(req, res, next))
			.then(x => reply(res, x))
			.catch(err => ((err instanceof APIError) ?
				reply(res, { _code: err.statusCode, _message: err.statusMessage, ...err.body }) :
				next(err)));
	const arr = [];
	if (!config.guest)
		arr.push((req, res, next) => (('user_id' in req.session) ? next() : reply(res, { _code: 401, _message: 'Unauthorized' })));
	if (config.validation)
	{
		arr.push(checkSchema(config.validation));
		arr.push((req, res, next) => {
			const errors = validationResult(req);
			if (errors.isEmpty())
				next();
			else
				reply(res, { _code: 400, _message: 'Bad Request', errors: errors.array() });
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
					format.default = () => reply(res, { _code: 406, _message: 'Format not supported' });
				res.format(format);
			});
		else
			arr.push(callback);
	}
	// console.log(arr, config);
	return arr;
};

module.exports = {
	send,
	ok,
	APIError,
	api
};