const { User, Friend, ChatGroup, GroupMember } = require('../models/sync');
const { Op } = require('sequelize');
const logger = require('../logger');
const { sequelize } = require('../config/database');

exports.getFriends = async (req, res) => {
	try {
		const userId = req.user.id;
		logger.info(`Fetching friends for user ${userId}`);

		// Get unique friends by using subquery
		const friends = await User.findAll({
			attributes: ['id', 'username', 'email'],
			include: [
				{
					model: User,
					as: 'Friends',
					attributes: [],
					through: { attributes: [] },
					where: { id: userId },
				},
			],
			where: {
				id: { [Op.ne]: userId }, // Exclude current user
			},
		});

		logger.info(`Retrieved ${friends.length} friends for user ${userId}`);
		return res.status(200).json(friends);
	} catch (error) {
		logger.error('Error fetching friends:', error);
		return res.status(500).json({
			message: 'Error fetching friends',
			error: error.message,
		});
	}
};

exports.addFriend = async (req, res) => {
	try {
		const userId = req.user.id;
		const { friendId } = req.body;

		logger.info(`Add friend request: ${userId} -> ${friendId}`);

		// Check if friendship already exists
		const existingFriendship = await Friend.findOne({
			where: {
				[Op.or]: [
					{ user1_id: userId, user2_id: friendId },
					{ user1_id: friendId, user2_id: userId },
				],
			},
		});

		if (existingFriendship) {
			logger.info('Friendship already exists');
			return res.status(400).json({ message: 'Already friends' });
		}

		// Start transaction
		const t = await sequelize.transaction();

		try {
			// Create bi-directional friendship
			await Promise.all([
				Friend.create(
					{ user1_id: userId, user2_id: friendId },
					{ transaction: t },
				),
				Friend.create(
					{ user1_id: friendId, user2_id: userId },
					{ transaction: t },
				),
			]);

			// Get both users' details
			const [user, friend] = await Promise.all([
				User.findByPk(userId, { attributes: ['id', 'username', 'email'] }),
				User.findByPk(friendId, { attributes: ['id', 'username', 'email'] }),
			]);

			// Create a direct message chat group
			const chatGroup = await ChatGroup.create(
				{
					name: [user.username, friend.username].sort().join(', '),
					type: 'direct',
					owner_id: userId,
				},
				{ transaction: t },
			);

			// Add both users to the chat group
			await Promise.all([
				GroupMember.create(
					{
						group_id: chatGroup.id,
						user_id: userId,
						role: 'member',
					},
					{ transaction: t },
				),
				GroupMember.create(
					{
						group_id: chatGroup.id,
						user_id: friendId,
						role: 'member',
					},
					{ transaction: t },
				),
			]);

			await t.commit();

			// Get complete chat group data
			const chatGroupWithMembers = await ChatGroup.findByPk(chatGroup.id, {
				include: [
					{
						model: User,
						as: 'members',
						attributes: ['id', 'username', 'email'],
					},
				],
			});

			// Emit socket events
			logger.info(`Emitting events to users ${userId} and ${friendId}`);

			// Friend added event
			req.io.to(`user_${userId}`).emit('friendAdded', {
				message: `${friend.username} is now your friend`,
				friend,
			});

			req.io.to(`user_${friendId}`).emit('friendAdded', {
				message: `${user.username} added you as a friend`,
				friend: user,
			});

			// Chat group created event
			req.io
				.to(`user_${userId}`)
				.emit('chatGroupCreated', chatGroupWithMembers);
			req.io
				.to(`user_${friendId}`)
				.emit('chatGroupCreated', chatGroupWithMembers);

			return res.status(201).json({
				message: 'Friend added successfully',
				friend,
				chatGroup: chatGroupWithMembers,
			});
		} catch (error) {
			await t.rollback();
			throw error;
		}
	} catch (error) {
		logger.error('Error in addFriend:', error);
		return res.status(500).json({
			message: 'Error adding friend',
			error: error.message,
		});
	}
};
