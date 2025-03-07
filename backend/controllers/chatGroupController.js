const { ChatGroup } = require('../models/ChatGroup');
const { User } = require('../models/User');
const { GroupMember } = require('../models/GroupMember');

exports.createChatGroup = async (req, res) => {
	try {
		const { name, description, owner_id } = req.body;

		const owner = await User.findOne({ where: { uid: owner_id } });
		if (!owner) {
			return res.status(404).json({ message: 'Chủ nhóm không tồn tại' });
		}

		const newGroup = await ChatGroup.create({ name, description, owner_id });
		return res
			.status(201)
			.json({ message: 'Nhóm chat được tạo thành công', group: newGroup });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Lỗi khi tạo nhóm', error: error.message });
	}
};

exports.updateMemberInGroup = async(req, res) => {
	try {
		const { group_id, user_id, role, alias } = req.body;

		const group = await ChatGroup.findOne({ where: { uid: group_id } });
		if (!group) {
			return res.status(404).json({ message: 'Nhóm không tồn tại' });
		}

		const user = await User.findOne({ where: { uid: user_id } });
		if (!user) {
			return res.status(404).json({ message: 'Người dùng không tồn tại' });
		}

		const member = await GroupMember.findOne({ where: { group_id, user_id } });
		if (!member) {
			return res
				.status(404)
				.json({ message: 'Người dùng không phải là thành viên của nhóm' });
		}

		if (role) member.role = role;
		if (alias) member.alias = alias;

		await member.save();
		return res.status(200).json({
			message: 'Cập nhật thành viên thành công',
			member,
		});
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Lỗi khi cập nhật thành viên', error: error.message });
	}
};

exports.addMember = async (req, res) => {
	try {
		const { group_id, user_id } = req.body;

		const group = await ChatGroup.findOne({ where: { uid: group_id } });
		if (!group) {
			return res.status(404).json({ message: 'Nhóm không tồn tại' });
		}

		const user = await User.findOne({ where: { uid: user_id } });
		if (!user) {
			return res.status(404).json({ message: 'Người dùng không tồn tại' });
		}

		const existingMember = await GroupMember.findOne({
			where: { group_id, user_id },
		});
		if (existingMember) {
			return res
				.status(400)
				.json({ message: 'Người dùng đã là thành viên của nhóm' });
		}

		const newMember = await GroupMember.create({
			group_id,
			user_id,
			role: 'member',
		});
		return res
			.status(201)
			.json({ message: 'Thêm thành viên thành công', member: newMember });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Lỗi khi thêm thành viên', error: error.message });
	}
};

exports.removeMember = async (req, res) => {
	try {
		const { group_id, user_id } = req.body;

		const group = await ChatGroup.findOne({ where: { uid: group_id } });
		if (!group) {
			return res.status(404).json({ message: 'Nhóm không tồn tại' });
		}

		const user = await User.findOne({ where: { uid: user_id } });
		if (!user) {
			return res.status(404).json({ message: 'Người dùng không tồn tại' });
		}

		const member = await GroupMember.findOne({ where: { group_id, user_id } });
		if (!member) {
			return res
				.status(404)
				.json({ message: 'Người dùng không phải là thành viên của nhóm' });
		}

		await member.destroy();
		return res.status(200).json({ message: 'Xóa thành viên thành công' });
	} catch (error) {
		return res
			.status(500)
			.json({ message: 'Lỗi khi xóa thành viên', error: error.message });
	}
};
