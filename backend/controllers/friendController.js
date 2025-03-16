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

exports.addFriend = async (req, res) => {
	try {
		const userId = req.user.id;
		const { friendId } = req.body;
		const friend = await Friend.create({
			user1_id: userId,
			user2_id: friendId,
		});
		return res.status(201).json(friend);
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error adding friend', error: error.message });
	}
};
