const Message = require('../models/Message');
const User = require('../models/User');
const logger = require('../logger');

exports.getChatMessages = async (req, res) => {
	try {
		const chatId = req.params.chatId;
		logger.info(`Fetching messages for chat: ${chatId}`);

		const messages = await Message.findAll({
			where: { group_id: chatId },
			include: [
				{
					model: User,
					as: 'sender',
					attributes: ['id', 'username'],
				},
			],
			order: [['created_at', 'ASC']],
		});

		// Transform messages to include sender info and type
		const transformedMessages = messages.map((msg) => ({
			id: msg.id,
			content: msg.content,
			sender_id: msg.sender_id,
			sender_name: msg.sender.username,
			created_at: msg.created_at,
			type: msg.type, // Add this line
		}));

		logger.info(`Found ${messages.length} messages`);
		return res.status(200).json(transformedMessages);
	} catch (error) {
		logger.error('Error fetching messages:', error);
		return res.status(500).json({
			message: 'Error fetching messages',
			error: error.message,
		});
	}
};
