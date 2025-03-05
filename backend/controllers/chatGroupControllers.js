const { ChatGroup } = require('../models/ChatGroup');
const { User } = require('../models/User');

exports.createChatGroup = async (req, res) => {
	try {
		const { name, description, owner_id } = req.body;

		const owner = await User.findOne({ where: { uid: owner_id } });
		if (!owner) {
			return res.status(404).json({ message: 'Chủ nhóm không tồn tại' });
		}

		const newGroup = await ChatGroup.create({ name, description, owner_id });
		return res.status(201).json({ message: 'Nhóm chat được tạo thành công', group: newGroup });
	} catch (error) {
		return res.status(500).json({ message: 'Lỗi khi tạo nhóm', error: error.message });
	}
};
