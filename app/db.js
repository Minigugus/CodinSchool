'use strict';

const Sequelize = require('sequelize');

const config = require('./config');

const sequelize = new Sequelize({
	dialect: config.db_dialect,
	storage: config.db_storage,
	host: config.db_host,
	database: config.db_name,
	username: config.db_user,
	password: config.db_password,

	logging: null
});

module.exports = sequelize.import('./models');
module.exports.sequelize = sequelize;
module.exports.sync = sequelize.sync.bind(sequelize);