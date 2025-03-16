const { Op } = require('sequelize');
const User = require('../models/User');

exports.findUser = async (req, res) => {
	try {
		const { query } = req.query;

		if (!query) {
			return res.status(400).json({ message: 'Please enter a search keyword' });
		}

		const users = await User.findAll({
			where: {
				[Op.or]: [
					{ username: { [Op.like]: `%${query}%` } },
					{ uid: { [Op.like]: `%${query}%` } },
				],
			},
			attributes: { exclude: ['password'] },
		});

		if (users.length === 0) {
			return res.status(404).json({ message: 'No users found' });
		}

		return res.status(200).json(users);
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error finding users', error: error.message });
	}
};
