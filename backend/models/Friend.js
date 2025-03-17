const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class Friend extends Model {}
Friend.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		user1_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		user2_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
		created_at: {
			type: DataTypes.DATE,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
		},
	},
	{
		sequelize,
		modelName: 'Friend',
		tableName: 'Friends',
		timestamps: false,
		indexes: [
			{
				unique: true,
				fields: ['user1_id', 'user2_id'],
			},
		],
	},
);

module.exports = Friend;
