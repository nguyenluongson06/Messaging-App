const { ChatGroup, User, GroupMember, Message } = require('../models/sync');
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
		const requesterId = req.user.id;

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
			return res.status(400).json({
				message: 'User is already a member of the group',
			});
		}

		// Create new member
		const newMember = await GroupMember.create({
			group_id,
			user_id,
			role: 'member',
		});

		// Create system message
		const systemMessage = await Message.create({
			sender_id: requesterId,
			group_id: group_id,
			content: `${user.username} was added to the group`,
			type: 'system',
		});

		// Get updated group data
		const updatedGroup = await ChatGroup.findOne({
			where: { id: group_id },
			include: [
				{
					model: User,
					as: 'members',
					attributes: ['id', 'username', 'email'],
				},
			],
		});

		// Send system message and updates through socket
		if (req.io) {
			// Emit system message
			const messageData = {
				id: systemMessage.id,
				content: systemMessage.content,
				type: 'system',
				created_at: systemMessage.created_at,
				sender_name: 'System',
			};

			// Send message to group chat
			req.io.to(`chat_${group_id}`).emit('message', messageData);

			// Update group data for all members
			updatedGroup.members.forEach((member) => {
				req.io.to(`user_${member.id}`).emit('chatGroupUpdated', updatedGroup);
			});
		}

		return res.status(201).json(updatedGroup);
	} catch (error) {
		logger.error('Error adding member:', error);
		return res.status(500).json({
			message: 'Error adding member',
			error: error.message,
		});
	}
};

exports.removeMember = async (req, res) => {
	try {
		const { group_id, user_id } = req.body;
		const requesterId = req.user?.id;

		// Add debug logging
		logger.debug('Remove member request:', {
			group_id,
			user_id,
			requesterId,
			headers: req.headers,
		});

		if (!requesterId) {
			logger.error('No requester ID found in token');
			return res.status(401).json({
				message: 'Authentication failed - no user ID found',
			});
		}

		// Find the chat group
		const group = await ChatGroup.findByPk(group_id, {
			include: [
				{
					model: User,
					as: 'members',
					attributes: ['id', 'username', 'email'],
				},
			],
		});

		if (!group) {
			logger.warn(`Group not found: ${group_id}`);
			return res.status(404).json({ message: 'Group not found' });
		}

		// Check if requester is the group owner
		if (group.owner_id !== requesterId) {
			logger.warn(
				`Unauthorized removal attempt: ${requesterId} tried to remove ${user_id} from group ${group_id}`,
			);
			return res.status(403).json({
				message: 'Only group owner can remove members',
			});
		}

		// Check if user to remove exists in group
		const memberExists = await GroupMember.findOne({
			where: {
				group_id,
				user_id,
			},
		});

		if (!memberExists) {
			return res
				.status(404)
				.json({ message: 'User is not a member of this group' });
		}

		// Cannot remove the owner
		if (user_id === group.owner_id) {
			return res.status(400).json({ message: 'Cannot remove the group owner' });
		}

		// Get user info before removal
		const removedUser = await User.findByPk(user_id);
		const systemMessage = await Message.create({
			sender_id: requesterId,
			group_id: group_id,
			content: `${removedUser.username} was removed from the group`,
			type: 'system',
		});

		// Send the system message with correct type
		const messageData = {
			id: systemMessage.id,
			content: systemMessage.content,
			type: 'system',
			created_at: systemMessage.created_at,
			sender_name: 'System',
		};

		req.io.to(`chat_${group_id}`).emit('message', messageData);

		// Remove the member
		await GroupMember.destroy({
			where: {
				group_id,
				user_id,
			},
		});

		// Get updated group data
		const updatedGroup = await ChatGroup.findByPk(group_id, {
			include: [
				{
					model: User,
					as: 'members',
					attributes: ['id', 'username', 'email'],
				},
			],
		});

		// Notify all members about the update via socket
		if (req.io) {
			// Send the system message
			const messageData = {
				id: systemMessage.id,
				content: systemMessage.content,
				type: 'system',
				created_at: systemMessage.created_at,
			};

			req.io.to(`chat_${group_id}`).emit('message', messageData);

			// Notify removed user
			req.io.to(`user_${user_id}`).emit('removedFromGroup', {
				group_id,
				message: 'You have been removed from the group',
			});

			// Notify about member removal
			req.io.to(`chat_${group_id}`).emit('memberRemoved', {
				username: removedUser.username,
				group_id,
			});

			// Notify remaining members
			updatedGroup.members.forEach((member) => {
				req.io.to(`user_${member.id}`).emit('chatGroupUpdated', updatedGroup);
			});
		}

		logger.info(
			`User ${user_id} removed from group ${group_id} by ${requesterId}`,
		);
		return res.status(200).json(updatedGroup);
	} catch (error) {
		logger.error('Error removing member:', error);
		return res.status(500).json({
			message: 'Error removing member from group',
			error: error.message,
		});
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

// Get specific chat group
exports.getChatGroup = async (req, res) => {
	try {
		const groupId = req.params.id;
		const userId = req.user.id;

		const chat = await ChatGroup.findOne({
			where: { id: groupId },
			include: [
				{
					model: User,
					as: 'members',
					attributes: ['id', 'username', 'email'],
				},
			],
		});

		if (!chat) {
			return res.status(404).json({ message: 'Chat group not found' });
		}

		// Verify user is member of the group
		if (!chat.members.some((member) => member.id === userId)) {
			return res.status(403).json({ message: 'Not a member of this group' });
		}

		return res.status(200).json(chat);
	} catch (error) {
		logger.error('Error fetching chat group:', error);
		return res.status(500).json({ message: 'Error fetching chat group' });
	}
};

// Update chat group name
exports.updateChatGroup = async (req, res) => {
	try {
		const { id } = req.params;
		const { name } = req.body;

		const chat = await ChatGroup.findByPk(id);
		if (!chat) {
			return res.status(404).json({ message: 'Chat group not found' });
		}

		chat.name = name;
		await chat.save();

		// Get updated chat with members
		const updatedChat = await ChatGroup.findOne({
			where: { id },
			include: [
				{
					model: User,
					as: 'members',
					attributes: ['id', 'username', 'email'],
				},
			],
		});

		// Notify all members about the update
		updatedChat.members.forEach((member) => {
			req.io.to(`user_${member.id}`).emit('chatGroupUpdated', updatedChat);
		});

		return res.status(200).json(updatedChat);
	} catch (error) {
		logger.error('Error updating chat group:', error);
		return res.status(500).json({ message: 'Error updating chat group' });
	}
};

// Leave group
exports.leaveGroup = async (req, res) => {
	try {
		const { group_id } = req.body;
		const userId = req.user.id;

		const group = await ChatGroup.findByPk(group_id);
		if (!group) {
			return res.status(404).json({ message: 'Group not found' });
		}

		// Check if user is the owner
		if (group.owner_id === userId) {
			return res.status(400).json({
				message:
					'Group owner cannot leave. Transfer ownership first or delete the group.',
			});
		}

		const member = await GroupMember.findOne({
			where: { group_id, user_id: userId },
		});

		if (!member) {
			return res.status(404).json({ message: 'Not a member of this group' });
		}

		// Get user info before leaving
		const leavingUser = await User.findByPk(userId);
		const systemMessage = await Message.create({
			sender_id: userId,
			group_id: group_id,
			content: `${leavingUser.username} left the group`,
			type: 'system',
		});

		await member.destroy();

		// Get updated group data
		const updatedGroup = await ChatGroup.findOne({
			where: { id: group_id },
			include: [
				{
					model: User,
					as: 'members',
					attributes: ['id', 'username', 'email'],
				},
			],
		});

		// Notify remaining members
		updatedGroup.members.forEach((member) => {
			req.io.to(`user_${member.id}`).emit('chatGroupUpdated', updatedGroup);
		});

		// Notify remaining members
		if (req.io) {
			// Send the system message
			const messageData = {
				id: systemMessage.id,
				content: systemMessage.content,
				type: 'system',
				created_at: systemMessage.created_at,
			};

			req.io.to(`chat_${group_id}`).emit('message', messageData);

			req.io.to(`chat_${group_id}`).emit('memberLeft', {
				username: leavingUser.username,
				group_id,
			});
		}

		return res.status(200).json({ message: 'Successfully left the group' });
	} catch (error) {
		logger.error('Error leaving group:', error);
		return res.status(500).json({ message: 'Error leaving group' });
	}
};
