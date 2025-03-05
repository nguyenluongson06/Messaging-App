const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

class ChatGroup extends Model {}
ChatGroup.init(
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		uid: { type: DataTypes.STRING(10), unique: true, allowNull: false },
		name: { type: DataTypes.STRING(255), allowNull: false },
		description: { type: DataTypes.TEXT },
		owner_id: {
			type: DataTypes.STRING(10),
			allowNull: false,
			references: { model: User, key: 'uid' },
		},
		created_at: { type: DataTypes.DATE, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') },
		updated_at: { type: DataTypes.DATE, defaultValue: sequelize.literal('CURRENT_TIMESTAMP') },
	},
	{ sequelize, modelName: 'ChatGroup', timestamps: false },
);

module.exports = ChatGroup;
