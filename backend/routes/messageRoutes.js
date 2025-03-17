const router = require('express').Router();
const { getChatMessages } = require('../controllers/messageController');
const { authenticateToken } = require('../middlewares/auth');

/**
 * @swagger
 * /messages/{chatId}:
 *   get:
 *     summary: Get messages for a chat room
 *     tags: [Messages]
 *     parameters:
 *       - in: path
 *         name: chatId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Messages fetched successfully
 *       500:
 *         description: Error fetching messages
 */
router.get('/:chatId', authenticateToken, getChatMessages);

module.exports = router;
