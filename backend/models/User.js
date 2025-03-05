const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/database');

class User extends Model {}
User.init(
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		uid: { type: DataTypes.STRING(10), unique: true, allowNull: false },
		email: { type: DataTypes.STRING(255), unique: true, allowNull: false },
		username: { type: DataTypes.STRING(255), unique: true, allowNull: false },
		password: { type: DataTypes.STRING(255), allowNull: false },
		created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
		updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
	},
	{ sequelize, modelName: 'User', timestamps: false },
);

module.exports = User;
