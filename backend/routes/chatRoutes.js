const express = require('express');
const router = express.Router();
const {
	createChatGroup,
	updateChatGroup,
	addMember,
	removeMember,
	leaveGroup,
	getUserChats,
	getChatGroup,
} = require('../controllers/chatGroupController');
const { authenticateToken, isGroupOwner } = require('../middlewares/auth');
const {
	validateGroupCreation,
	validateGroupMemberOperation,
} = require('../middlewares/validation');
const logger = require('../logger');

// Debug middleware for remove-member route
const debugRemoveMember = (req, res, next) => {
	logger.debug('Remove member request received:', {
		body: req.body,
		auth: req.headers.authorization ? 'Token present' : 'No token',
		user: req.user,
	});
	next();
};

// Get all user's chats
router.get('/', authenticateToken, getUserChats);

// Get specific chat group
router.get('/:id', authenticateToken, getChatGroup);

// Create new chat group
router.post(
	'/create',
	authenticateToken,
	validateGroupCreation,
	createChatGroup,
);

// Update chat group name
router.put('/:id', authenticateToken, isGroupOwner, updateChatGroup);

// Add member to group
router.post(
	'/add-member',
	authenticateToken,
	isGroupOwner,
	validateGroupMemberOperation,
	addMember,
);

// Remove member from group
router.post(
	'/remove-member',
	authenticateToken,
	isGroupOwner,
	validateGroupMemberOperation,
	debugRemoveMember,
	removeMember,
);

// Leave group
router.post('/leave', authenticateToken, leaveGroup);

module.exports = router;
