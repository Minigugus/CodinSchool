'use strict';

const { checkSchema, validationResult } = require('express-validator/check');

const db = require('./db');

const send = (res, code, { message, ...body }) => body ? res.status(code, message).json(body) : res.status(code, message).end();

const ok = (res, body) => send(res, body ? 200 : 204, body);

module.exports = {
	send,
	ok
};