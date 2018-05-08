'use strict';

const production = (process.env.NODE_ENV === 'production');

module.exports = {
	production: production,
	port: process.env.PORT || (production ? 80 : 3000),
	api_url_base: process.env.API_URL_BASE || '/api'
};