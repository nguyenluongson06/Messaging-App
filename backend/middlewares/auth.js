const jwt = require('jsonwebtoken');
const { User } = require('../models/sync');
const logger = require('../logger');

const authenticateToken = async (req, res, next) => {
	try {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];

		if (!token) {
			return res.status(401).json({ message: 'No token provided' });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Fetch complete user object
		const user = await User.findByPk(decoded.id, {
			attributes: ['id', 'username', 'email'],
		});

		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		req.user = user;
		next();
	} catch (error) {
		logger.error('Auth error:', error);
		return res.status(403).json({ message: 'Invalid token' });
	}
};

const isGroupOwner = async (req, res, next) => {
	const { group_id } = req.body;
	const group = await ChatGroup.findOne({ where: { id: group_id } });
	if (!group) return res.status(404).json({ message: 'Group not found.' });

	if (group.owner_id !== req.user.id) {
		return res.status(403).json({
			message: 'Access denied. Only group owner can perform this action.',
		});
	}
	next();
};

const socketAuth = (socket, next) => {
	try {
		const token = socket.handshake.auth.token;

		if (!token) {
			logger.error('Socket auth failed: No token provided');
			return next(new Error('No token provided'));
		}

		const cleanToken = token.replace('Bearer ', '');

		try {
			const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
			socket.user = decoded;
			logger.info(`Socket authenticated for user: ${decoded.id}`);
			next();
		} catch (err) {
			logger.error('Invalid token:', err);
			next(new Error('Invalid token'));
		}
	} catch (err) {
		logger.error('Socket auth error:', err);
		next(new Error('Authentication error'));
	}
};

module.exports = { authenticateToken, isGroupOwner, socketAuth };
