const { User } = require('../models/sync');
const { Op } = require('sequelize');
const logger = require('../logger');

exports.searchUsers = async (req, res) => {
	try {
		const { username } = req.query;
		const currentUserId = req.user.id;

		const users = await User.findAll({
			where: {
				username: {
					[Op.like]: `%${username}%`,
				},
				id: {
					[Op.ne]: currentUserId, // Exclude current user
				},
			},
			attributes: ['id', 'username', 'email'],
		});

		return res.status(200).json(users);
	} catch (error) {
		logger.error('Error searching users:', error);
		return res.status(500).json({ message: 'Error searching users' });
	}
};
