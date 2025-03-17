const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class GroupMember extends Model {}
GroupMember.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		group_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
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
		alias: {
			type: DataTypes.STRING(255),
		},
	},
	{
		sequelize,
		modelName: 'GroupMember',
		tableName: 'ChatGroupMembers',
		timestamps: false,
	},
);

module.exports = GroupMember;
