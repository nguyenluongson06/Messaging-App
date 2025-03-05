const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const ChatGroup = require('./ChatGroup');
const User = require('./User');

class GroupMember extends Model {}
GroupMember.init(
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		group_id: {
			type: DataTypes.STRING(10),
			allowNull: false,
			references: { model: ChatGroup, key: 'uid' },
		},
		user_id: {
			type: DataTypes.STRING(10),
			allowNull: false,
			references: { model: User, key: 'uid' },
		},
		role: {
			type: DataTypes.ENUM('member', 'admin', 'owner'),
			allowNull: false,
			defaultValue: 'member',
		},
		joined_at: {
			type: DataTypes.DATE,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
		},
		alias: { type: DataTypes.STRING(255) },
	},
	{ sequelize, modelName: 'GroupMember', timestamps: false },
);

module.exports = GroupMember;
