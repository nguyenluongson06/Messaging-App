const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class ChatGroup extends Model {}
ChatGroup.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING(255),
			allowNull: false,
		},
		type: {
			type: DataTypes.ENUM('direct', 'group'),
			allowNull: false,
			defaultValue: 'group',
		},
		owner_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		created_at: {
			type: DataTypes.DATE,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
		},
		updated_at: {
			type: DataTypes.DATE,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
			onUpdate: sequelize.literal('CURRENT_TIMESTAMP'),
		},
	},
	{
		sequelize,
		modelName: 'ChatGroup',
		tableName: 'ChatGroups',
		timestamps: false,
	},
);

module.exports = ChatGroup;
