'use strict';

module.exports = (models, sequelize, DataTypes) => sequelize.define('User', {
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
	},
	isAdmin: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
		allowNull: false
	},

	// Preferences
	isEmailVisible: {
		type: DataTypes.BOOLEAN,
		defaultValue: false,
		allowNull: false
	}
}, {
	scopes: {
		public: {
			attributes: [
				'id',
				'lastname',
				'firstname',
				'email',
				'isAdmin',
				'isEmailVisible',
				'enabled'
			],
			include: [
				{
					model: models.Role,
					required: false,
					as: 'roles',
					attributes: [
						'id',
						'name'
					]
				}
			]
		},
		self: {
			attributes: [
				'id',
				'lastname',
				'firstname',
				'email',
				'isAdmin',
				'enabled',
			],
			include: [
				{
					model: models.Role,
					required: false,
					as: 'roles',
					attributes: [
						'id',
						'name'
					]
				}
			]
		},
		preferences: {
			attributes: [
				'isEmailVisible',
			]
		}
	}
})