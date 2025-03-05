const { saveMessage, getChatHistory } = require('../services/chatService');
const { getPublicKey } = require('../services/e2eeService');
const { encryptMessage } = require('../middlewares/encrypt');
const logger = require('../config/logger');

module.exports = function (io) {
	io.on('connection', (socket) => {
		console.log('User connected:', socket.id);

		// Join group chat
		socket.on('join-group', async ({ userId, groupId }) => {
			socket.join(groupId);
			const history = await getChatHistory(groupId);
			socket.emit('chat-history', history);
		});

		// Send message
		socket.on('send-message', async ({ senderId, groupId, message }) => {
			const recipientKey = await getPublicKey(senderId);
			if (!recipientKey) return;

			const { nonce, cipherText } = await encryptMessage(
				message,
				recipientKey,
				senderPrivateKey,
			);
			const encryptedMessage = Buffer.concat([nonce, cipherText]).toString(
				'base64',
			);

			await saveMessage(senderId, groupId, encryptedMessage);
			io.to(groupId).emit('receive-message', { senderId, encryptedMessage });

			logger.info(`Message sent in group ${groupId} by ${senderId}`);
		});
	});
};
