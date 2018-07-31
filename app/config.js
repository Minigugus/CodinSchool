'use strict';

const production = (process.env.NODE_ENV === 'production');
const isNowShHosted = !!process.env.NOW_URL;

module.exports = {
	production: production,

	log_requests: (process.env.LOG_REQUESTS === 'false' ? false : (process.env.LOG_REQUESTS ? process.env.LOG_REQUESTS : true)),
	serve_static: !(process.env.SERVE_STATIC === 'false' || false),

	root_url: process.env.ROOT_URL || (isNowShHosted ? process.env.NOW_URL : null),
	origin: process.env.ORIGIN || (isNowShHosted ? process.env.NOW_URL.slice(8) : '*'),

	port: process.env.PORT || (production ? 80 : 3000),
	root: process.env.ROOT || '/',

	use_rate_limiter: (process.env.USE_RATE_LIMITER === 'true') || production;

	bcrypt_rounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 10, // Don't change this if users are already registered !

	session_cookie_secure: ('SESSION_COOKIE_SECURE' in process.env ? process.env.SESSION_COOKIE_SECURE : production),
	session_cookie_name: process.env.SESSION_COOKIE_NAME || 'codinschool_session',
	session_secret: process.env.SESSION_SECRET || 'codinschool',

	db_dialect: process.env.DB_DIALECT || 'sqlite',
	db_storage: process.env.DB_STORAGE,
	db_host: process.env.DB_HOST,
	db_port: process.env.DB_PORT,
	db_name: process.env.DB_NAME,
	db_user: process.env.DB_USER,
	db_password: process.env.DB_PASS,

	// evaluation: {
	// 	queue_refresh_time: process.env.EVAL_QUEUE_REFRESH_TIME || 2000,
	// 	tmp_dir: process.env.EVAL_TMP_DIR || process.env.TMP
	// }
};