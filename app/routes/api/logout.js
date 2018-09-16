'use strict';

module.exports = {
	GET: ({ req }) => new Promise((res, rej) => req.session.destroy(err => (err ? rej(err) : res())))
};