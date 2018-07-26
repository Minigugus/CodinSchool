'use strict';

module.exports = (models, sequelize, DataTypes) => sequelize.define('Role', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	}
});