require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { sequelize, connectWithRetry } = require('./config/database');
const logger = require('./logger');

// Import routes
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const friendRoutes = require('./routes/friendRoutes');
const messageRoutes = require('./routes/messageRoutes');
const initializeSocketServer = require('./socketServer');
const errorHandler = require('./middlewares/errorHandler');
const setupSwagger = require('./swagger');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
	res.status(200).json({ status: 'healthy' });
});

// Initialize socket.io
const { server, io } = initializeSocketServer(app);

// Middleware to attach io to req object
app.use((req, res, next) => {
	req.io = io;
	next();
});

// API Routes - prefix with /api
app.use('/api/auth', authRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/messages', messageRoutes);
// Add to existing routes
app.use('/api/users', require('./routes/userRoutes'));

// API Documentation
setupSwagger(app);

// Error handler
app.use(errorHandler);

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch-all handler to serve the index.html file for any unknown routes
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// API error handler
app.use((err, req, res, next) => {
	logger.error(err.stack);
	res.status(500).json({ message: 'Something broke!', error: err.message });
});

// Catch-all handler for API routes only
app.use('/api/*', (req, res) => {
	res.status(404).json({ message: 'API endpoint not found' });
});

// Start server function
async function startServer() {
	try {
		// Wait for database connection
		await connectWithRetry();

		// Sync database
		await sequelize.sync({ force: false });
		logger.info('Database synchronized');

		// Start server
		const PORT = process.env.PORT || 3000;
		server.listen(PORT, () => {
			logger.info(`Server is running on port ${PORT}`);
		});
	} catch (error) {
		logger.error('Failed to start server:', error);
		process.exit(1);
	}
}

// Start the server
startServer();

module.exports = app;
