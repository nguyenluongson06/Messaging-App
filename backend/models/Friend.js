const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./User');

class Friend extends Model {}
Friend.init(
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		user1_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: User, key: 'id' },
		},
		user2_id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: { model: User, key: 'id' },
		},
	},
	{ sequelize, modelName: 'Friend', timestamps: false },
);

module.exports = Friend;
