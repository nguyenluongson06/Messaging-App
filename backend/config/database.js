const { Sequelize } = require('sequelize');
const logger = require('../logger');
require('dotenv').config();

const maxRetries = parseInt(process.env.DB_MAX_RETRIES) || 5;
const retryInterval = parseInt(process.env.DB_RETRY_INTERVAL) || 5000;

const sequelize = new Sequelize({
	dialect: 'mysql',
	host: process.env.DB_HOST || 'localhost',
	username: process.env.DB_USER || 'root',
	password: process.env.DB_PASSWORD || '',
	database: process.env.DB_NAME || 'chatdb',
	logging: (msg) => logger.debug(msg),
});

async function connectWithRetry(retries = maxRetries) {
	try {
		await sequelize.authenticate();
		logger.info('Database connection established successfully');

		// In development, sync database with { force: true }
		if (process.env.NODE_ENV === 'development') {
			await sequelize.sync({ force: true });
			logger.info('Database synced in development mode');
		} else {
			await sequelize.sync({ force: false });
			logger.info('Database synced');
		}

		return true;
	} catch (error) {
		logger.error(`Database connection failed: ${error.message}`);

		if (retries > 0) {
			logger.info(
				`Retrying in ${
					retryInterval / 1000
				} seconds... (${retries} attempts remaining)`,
			);
			await new Promise((resolve) => setTimeout(resolve, retryInterval));
			return connectWithRetry(retries - 1);
		}

		throw new Error('Failed to connect to database after multiple attempts');
	}
}

module.exports = { sequelize, connectWithRetry };
