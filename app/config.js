'use strict';

const production = (process.env.NODE_ENV === 'production');

module.exports = {
	production: production,

	port: process.env.PORT || (production ? 80 : 3000),
	api_url_base: process.env.API_URL_BASE || '/api',

	db_host: process.env.DB_HOST,
	db_port: process.env.DB_PORT,
	db_name: process.env.DB_NAME,
	db_user: process.env.DB_USER,
	db_password: process.env.DB_PASS,

	session_cookie_name: process.env.SESSION_COOKIE_NAME || 'codinschool_session',
	session_secret: process.env.SESSION_SECRET || 'codinschool',

	bcrypt_rounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 10 // Don't change this if users are already registered !
};