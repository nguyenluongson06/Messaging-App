const { User, Friend } = require('../models/sync');

exports.getFriends = async (req, res) => {
	try {
		const userId = req.user.id;
		const friends = await Friend.findAll({
			where: { user1_id: userId },
			include: [
				{ model: User, as: 'Friends', attributes: ['id', 'username', 'email'] },
			],
		});
		return res.status(200).json(friends);
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error fetching friends', error: error.message });
	}
};
