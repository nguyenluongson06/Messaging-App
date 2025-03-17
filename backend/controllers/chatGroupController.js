const { ChatGroup, User, GroupMember } = require('../models/sync');
const { Op } = require('sequelize');
const logger = require('../logger');

exports.createChatGroup = async (req, res) => {
	try {
		const { name, type, members } = req.body;
		const owner_id = req.user.id;

		logger.info(`Creating chat group: ${name}, type: ${type}`);

		// For direct chats, check if one already exists
		if (type === 'direct' && members?.length === 1) {
			const existingChat = await ChatGroup.findOne({
				where: {
					type: 'direct',
					'$members.id$': {
						[Op.in]: [owner_id, members[0]],
					},
				},
				include: [
					{
						model: User,
						as: 'members',
						attributes: ['id', 'username', 'email'],
					},
				],
			});

			if (existingChat) {
				logger.info(`Found existing direct chat: ${existingChat.id}`);
				return res.status(200).json(existingChat);
			}
		}

		// Create new chat group
		const newGroup = await ChatGroup.create({
			name,
			type: type || 'group',
			owner_id,
		});

		// Add all members including owner
		const memberIds = [...new Set([owner_id, ...(members || [])])];
		await Promise.all(
			memberIds.map((memberId) =>
				GroupMember.create({
					group_id: newGroup.id,
					user_id: memberId,
					role: memberId === owner_id ? 'owner' : 'member',
				}),
			),
		);

		// Get complete group data
		const groupWithMembers = await ChatGroup.findByPk(newGroup.id, {
			include: [
				{
					model: User,
					as: 'members',
					attributes: ['id', 'username', 'email'],
				},
			],
		});

		logger.info(`Created new chat group: ${newGroup.id}`);
		return res.status(201).json(groupWithMembers);
	} catch (error) {
		logger.error('Error creating chat group:', error);
		return res.status(500).json({ message: 'Error creating chat group' });
	}
};

exports.updateMemberInGroup = async (req, res) => {
	try {
		const { group_id, user_id, role, alias } = req.body;

		const group = await ChatGroup.findByPk(group_id);
		if (!group) {
			return res.status(404).json({ message: 'Group not found' });
		}

		const user = await User.findOne({ where: { id: user_id } });
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		const member = await GroupMember.findOne({ where: { group_id, user_id } });
		if (!member) {
			return res
				.status(404)
				.json({ message: 'User is not a member of the group' });
		}

		if (role) member.role = role;
		if (alias) member.alias = alias;

		await member.save();
		return res
			.status(200)
			.json({ message: 'Member updated successfully', member });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error updating member', error: error.message });
	}
};

exports.addMember = async (req, res) => {
	try {
		const { group_id, user_id } = req.body;

		const group = await ChatGroup.findByPk(group_id);
		if (!group) {
			return res.status(404).json({ message: 'Group not found' });
		}

		const user = await User.findOne({ where: { id: user_id } });
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		const existingMember = await GroupMember.findOne({
			where: { group_id, user_id },
		});
		if (existingMember) {
			return res
				.status(400)
				.json({ message: 'User is already a member of the group' });
		}

		const newMember = await GroupMember.create({
			group_id,
			user_id,
			role: 'member',
		});
		return res
			.status(201)
			.json({ message: 'Member added successfully', member: newMember });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error adding member', error: error.message });
	}
};

exports.removeMember = async (req, res) => {
	try {
		const { group_id, user_id } = req.body;

		const group = await ChatGroup.findByPk(group_id);
		if (!group) {
			return res.status(404).json({ message: 'Group not found' });
		}

		const user = await User.findOne({ where: { id: user_id } });
		if (!user) {
			return res.status(404).json({ message: 'User not found' });
		}

		const member = await GroupMember.findOne({ where: { group_id, user_id } });
		if (!member) {
			return res
				.status(404)
				.json({ message: 'User is not a member of the group' });
		}

		await member.destroy();
		return res.status(200).json({ message: 'Member removed successfully' });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error removing member', error: error.message });
	}
};

exports.getUserChats = async (req, res) => {
	try {
		const userId = req.user.id;
		logger.info(`Fetching chats for user: ${userId}`);

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

		logger.info(`Found ${chats.length} chats for user ${userId}`);
		return res.status(200).json(chats);
	} catch (error) {
		logger.error('Error fetching chats:', error);
		return res.status(500).json({ message: 'Error fetching chats' });
	}
};
