'use strict';

const Sequelize = require('sequelize');
const sequelize = new Sequelize({
	dialect: 'sqlite',
	storage: ':memory:'
});

module.exports = sequelize
module.exports.User = sequelize.import('./models/User.js');

sequelize.sync();