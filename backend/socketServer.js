const http = require('http');
const socketIo = require('socket.io');
const logger = require('./config/logger');
const chatSocket = require('./sockets/chatSocket');

// create http server from express
function initializeSocketServer(app) {
	const server = http.createServer(app);
	const io = socketIo(server, {
		cors: { origin: '*' }, // cross origin
	});

	chatSocket(io); // create chat socket

	io.on('connection', (socket) => {
		logger.info(`User connected: ${socket.id}`);

		socket.on('disconnect', () => {
			logger.info(`User disconnected: ${socket.id}`);
		});
	});

	return server;
}

module.exports = initializeSocketServer;
