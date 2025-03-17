const Message = require('../models/Message');

// save encrypted message to db
async function saveMessage(senderId, groupId, encryptedMessage) {
	await Message.create({ senderId, groupId, content: encryptedMessage });
}

// get chat history
async function getChatHistory(groupId) {
	return await Message.findAll({
		where: { groupId },
		order: [['created_at', 'ASC']],
	});
}

module.exports = { saveMessage, getChatHistory };
