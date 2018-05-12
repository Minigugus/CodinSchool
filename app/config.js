'use strict';

const production = (process.env.NODE_ENV === 'production');

module.exports = {
	production: production,

	port: process.env.PORT || (production ? 80 : 3000),
	api_url_base: process.env.API_URL_BASE || '/api',

	bcrypt_rounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 10, // Don't change this if users are already registered !

	session_cookie_secure: !!process.env.SESSION_COOKIE_SECURE || production,
	session_cookie_name: process.env.SESSION_COOKIE_NAME || 'codinschool_session',
	session_secret: process.env.SESSION_SECRET || 'codinschool',

	db_host: process.env.DB_HOST,
	db_port: process.env.DB_PORT,
	db_name: process.env.DB_NAME,
	db_user: process.env.DB_USER,
	db_password: process.env.DB_PASS,

	eval_tmp_dir: process.env.EVAL_TMP_DIR || process.env.TMP
};