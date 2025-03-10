const jwt = require('jsonwebtoken');
const { User } = require('../models/User');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
	const token = req.header('Authorization')?.split(' ')[1];
	if (!token)
		return res
			.status(401)
			.json({ message: 'Access denied. No token provided.' });

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		res.status(400).json({ message: 'Invalid token.' });
	}
};

const isGroupOwner = async (req, res, next) => {
	const { group_id } = req.body;
	const group = await ChatGroup.findOne({ where: { uid: group_id } });
	if (!group) return res.status(404).json({ message: 'Group not found.' });

	if (group.owner_id !== req.user.id) {
		return res
			.status(403)
			.json({
				message: 'Access denied. Only group owner can perform this action.',
			});
	}
	next();
};

module.exports = { authenticateToken, isGroupOwner };
