'use strict';

module.exports = (sequelize, DataTypes) => sequelize.define('User', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
		allowNull: false
	},
	lastname: {
		type: DataTypes.STRING,
		allowNull: false
	},
	firstname: {
		type: DataTypes.STRING,
		allowNull: false
	},
	password_hash: {
		type: DataTypes.STRING,
		allowNull: false
	},
	email: {
		type: DataTypes.STRING,
		unique: true,
		validate: {
			isEmail: true
		},
		allowNull: false
	},
	avatar: {
		type: DataTypes.STRING
	},
	enabled: {
		type: DataTypes.BOOLEAN,
		defaultValue: true,
		allowNull: false
	}
});