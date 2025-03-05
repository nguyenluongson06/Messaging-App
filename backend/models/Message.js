const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');
const ChatGroup = require('./ChatGroup');

class Message extends Model {}
Message.init(
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		sender_id: {
			type: DataTypes.STRING(10),
			allowNull: false,
			references: { model: User, key: 'uid' },
		},
		group_id: {
			type: DataTypes.STRING(10),
			allowNull: false,
			references: { model: ChatGroup, key: 'uid' },
		},
		content: { type: DataTypes.TEXT, allowNull: false },
		type: {
			type: DataTypes.ENUM('text', 'image', 'file'),
			allowNull: false,
			defaultValue: 'text',
		},
		created_at: {
			type: DataTypes.DATE,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
		},
	},
	{ sequelize, modelName: 'Message', timestamps: false },
);

module.exports = Message;
