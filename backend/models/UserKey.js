const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

class UserKey extends Model {}
UserKey.init(
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		user_id: {
			type: DataTypes.STRING(10),
			allowNull: false,
			references: { model: User, key: 'uid' },
		},
		public_key: { type: DataTypes.STRING(255), allowNull: false },
		private_key: { type: DataTypes.STRING(255), allowNull: false },
		created_at: {
			type: DataTypes.DATE,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
		},
		updated_at: {
			type: DataTypes.DATE,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
		},
	},
	{ sequelize, modelName: 'UserKey', timestamps: false },
);

module.exports = UserKey;
