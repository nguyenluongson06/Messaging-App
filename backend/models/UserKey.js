const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../config/database');

class UserKey extends Model {}
UserKey.init(
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Users',
				key: 'id',
			},
		},
		public_key: {
			type: DataTypes.TEXT,
			allowNull: false,
		},
		created_at: {
			type: DataTypes.DATE,
			defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
		},
	},
	{
		sequelize,
		modelName: 'UserKey',
		tableName: 'UserKeys',
		timestamps: false,
	},
);

module.exports = UserKey;
