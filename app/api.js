'use strict';

const log_error = require('debug')('codinschool:api:error');

const bodyParser = require('body-parser');

const config = require('./config.js');
const session = require('./session.js');

const api_errors = {
//  CODE_ERREUR: [ CODE_HTTP, MESSAGE ]
	  0: [ 200, undefined ],

	  1: [ 400, 'Bad request' ],
	  2: [ 404, 'Not found' ],

	 10: [ 401, 'You must be authentificated to use this operation' ],
	 11: [ 403, 'Invalid username or password' ],
	 12: [ 403, 'Wrong old password' ],
	 13: [ 403, 'Access denied' ],
	 14: [ 403, 'Username already registered' ],

	 20: [ 404, 'Exercice not found' ],

	255: [ 505, 'Internal server error' ]
}, api_codes = Object.keys(api_errors);

const reply = (res, code, data) => {
	code = `${code}`;
	if (api_codes.indexOf(code) === -1)
		error(res, `Unregistered API code`, new Error(`Code ${code} not found.`));
	else
	{
		const message = api_errors[code];
		res.status(message[0]).json({ code: code, message: message[1], data: data });
	}
};
const error = (res, msg, err) => {
	log_error(`${msg} : ${err}`);
	reply(res, 255, config.production ? undefined : ({ message: msg, error: err }));
};

const check = (req, res, next) => {
	if (!session.isValid(req))
		reply(res, 10);
	else
		next();
};
const validate = (parent, ...fields) => (req, res, next) => {
	if (!req[parent] || !fields.every(x => !!req[parent][x]))
		reply(res, 1);
	else
		next();
};

module.exports = {
	reply: reply,
	error: error,
	check: check,
	validate: validate,

	parsers: {
		json: bodyParser.json(),
		url: bodyParser.urlencoded({ extended: false })
	}
};