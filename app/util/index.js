'use strict';

const session = require('../session.js');

module.exports.check = (req, res, next) => {
	if (!session.isValid(req))
		res.status(401).json({ message: 'You must be authentificated to use this operation.' });
	else
		next();
};
module.exports.validate = (...fields) => (req, res, next) => {
	if (!req.body || !fields.every(x => !!req.body[x]))
		res.status(400).json({ message: 'Bad request.' });
	else
		next();
};