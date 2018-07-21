'use strict';

const { checkSchema, validationResult } = require('express-validator/check');

const db = require('./db');

const send = (res, code, body) => body ? res.status(code).json(body) : res.status(code).end();

const ok = (res, body) => send(res, body ? 200 : 204, body);

module.exports = {
	send,
	ok
};