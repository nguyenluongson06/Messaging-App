const http = require('http');
const socketIo = require('socket.io');
const logger = require('./logger');
const chatSocket = require('./sockets/chatSocket');
const jwt = require('jsonwebtoken');
const { Message, User } = require('./models/sync');

// create http server from express
function initializeSocketServer(app) {
	const server = http.createServer(app);
	const io = socketIo(server, {
		cors: {
			origin: 'http://localhost:3001',
			methods: ['GET', 'POST'],
			credentials: true, // Add this to allow credentials
		}, // cross origin
	});

	chatSocket(io); // create chat socket

	// Track connected users
	const connectedUsers = new Map();

	// Authentication middleware
	io.use((socket, next) => {
		const token = socket.handshake.auth.token;
		if (!token) {
			logger.error('Socket auth failed: No token');
			return next(new Error('Authentication error'));
		}

		try {
			// Remove 'Bearer ' if present
			const cleanToken = token.replace('Bearer ', '');
			const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
			socket.user = decoded;
			logger.info(`Socket authenticated for user: ${decoded.id}`);
			next();
		} catch (err) {
			logger.error('Socket auth failed:', err);
			next(new Error('Authentication error'));
		}
	});

	io.on('connection', (socket) => {
		logger.info(`Socket connected: ${socket.id} for user ${socket.user.id}`);

		// Store user connection and join personal room
		connectedUsers.set(socket.user.id, socket.id);
		socket.join(`user_${socket.user.id}`);

		// Handle joining chat rooms
		socket.on('joinRoom', (roomId) => {
			logger.info(`User ${socket.user.id} joining room: ${roomId}`);
			socket.join(roomId);
		});

		// Handle leaving chat rooms
		socket.on('leaveRoom', (roomId) => {
			logger.info(`User ${socket.user.id} leaving room: ${roomId}`);
			socket.leave(roomId);
		});

		// Handle messages
		socket.on('sendMessage', async (data) => {
			try {
				const { chatId, content } = data;
				logger.info(
					`New message from ${socket.user.id} to ${chatId}: ${content}`,
				);

				// Save message to database
				const message = await Message.create({
					sender_id: socket.user.id,
					group_id: chatId,
					content: content,
					type: 'text',
				});

				const messageWithSender = await Message.findOne({
					where: { id: message.id },
					include: [
						{
							model: User,
							as: 'sender',
							attributes: ['id', 'username'],
						},
					],
				});

				const messageData = {
					id: messageWithSender.id,
					content: messageWithSender.content,
					sender_id: messageWithSender.sender_id,
					sender_name: messageWithSender.sender.username,
					created_at: messageWithSender.created_at,
				};

				// Emit to the room
				io.to(`chat_${chatId}`).emit('message', messageData);
				logger.info(`Message broadcasted to room ${chatId}:`, messageData);
			} catch (error) {
				logger.error('Error handling message:', error);
				socket.emit('error', { message: 'Error sending message' });
			}
		});

		socket.on('disconnect', () => {
			connectedUsers.delete(socket.user.id);
			logger.info(`User disconnected: ${socket.user.id}`);
		});
	});

	return { server, io, connectedUsers };
}

module.exports = initializeSocketServer;
