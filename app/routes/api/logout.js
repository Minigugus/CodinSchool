'use strict';

module.exports = {
	"GET": ({ req, ok, fail }) => req.session.destroy(error => (error ? fail(error) : ok()))
};