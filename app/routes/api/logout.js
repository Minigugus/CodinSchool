'use strict';

const express = require('express');

const { ok } = require('../../api');

module.exports = express.Router()
.get('/', (req, res, next) => {
	if ('user_id' in req.session)
		req.session.destroy(err => ok(res));
	else
		next();
})