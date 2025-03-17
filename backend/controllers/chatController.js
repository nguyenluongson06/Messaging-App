const { ChatGroup, User, Message } = require('../models/sync');
const logger = require('../logger');

exports.createChat = async (req, res) => {
	try {
		const { name, type, members } = req.body;
		const userId = req.user.id;

		const chat = await ChatGroup.create({
			name,
			type,
			owner_id: userId,
		});

		// Add creator and selected members
		await chat.addMember(userId);
		if (members?.length) {
			await chat.addMembers(members);
		}

		// Fetch complete chat data with members
		const completeChat = await ChatGroup.findByPk(chat.id, {
			include: [
				{
					model: User,
					as: 'members',
					attributes: ['id', 'username', 'email'],
				},
			],
		});

		// Emit socket event to all members
		members.forEach((memberId) => {
			req.io.to(`user_${memberId}`).emit('chatGroupCreated', completeChat);
		});

		return res.status(201).json(completeChat);
	} catch (error) {
		logger.error('Error creating chat:', error);
		return res.status(500).json({ message: 'Error creating chat' });
	}
};

exports.getUserChats = async (req, res) => {
	try {
		const userId = req.user.id;

		const chats = await ChatGroup.findAll({
			include: [
				{
					model: User,
					as: 'members',
					attributes: ['id', 'username', 'email'],
				},
			],
			where: {
				'$members.id$': userId,
			},
		});

		return res.status(200).json(chats);
	} catch (error) {
		logger.error('Error fetching chats:', error);
		return res.status(500).json({ message: 'Error fetching chats' });
	}
};

// Add other endpoints for updating groups, adding/removing members, etc.
