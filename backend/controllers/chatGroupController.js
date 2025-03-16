const ChatGroup = require('../models/ChatGroup');
const User = require('../models/User');
const GroupMember = require('../models/GroupMember');

exports.createChatGroup = async (req, res) => {
	try {
		const { name, description } = req.body;
		const owner_id = req.user.id;

		const owner = await User.findOne({ where: { id: owner_id } });
		if (!owner) {
			return res.status(404).json({ message: 'Owner not found' });
		}
		const uid = Math.random().toString(36).substring(2, 12);
		const newGroup = await ChatGroup.create({
			uid: uid,
			name: name,
			description: description,
			owner_id: owner_id,
		});
		return res
			.status(201)
			.json({ message: 'Chat group created successfully', group: newGroup });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Error creating group', error: error.message });
	}
};

exports.updateMemberInGroup = async (req, res) => {
	try {
		const { group_id, user_id, role, alias } = req.body;

		const group = await ChatGroup.findOne({ where: { uid: group_id } });
		if (!group) {
			return res.status(404).json({ message: 'Group not found' });
		}

		const user = await User.findOne({ where: { uid: user_id } });
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

		const group = await ChatGroup.findOne({ where: { uid: group_id } });
		if (!group) {
			return res.status(404).json({ message: 'Group not found' });
		}

		const user = await User.findOne({ where: { uid: user_id } });
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

		const group = await ChatGroup.findOne({ where: { uid: group_id } });
		if (!group) {
			return res.status(404).json({ message: 'Group not found' });
		}

		const user = await User.findOne({ where: { uid: user_id } });
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
