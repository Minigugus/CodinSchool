'use strict';

module.exports = (sequelize, DataTypes) => {
	const models = {};
	models.Role = require('./Role')(models, sequelize, DataTypes);
	models.User = require('./User')(models, sequelize, DataTypes);

	models.User.belongsToMany(models.Role, { through: 'UserRole', as: 'roles' });
	models.Role.belongsToMany(models.User, { through: 'UserRole' });

	return models;
};