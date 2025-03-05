const express = require('express');
const router = express.Router();
const {
	createChatGroup,
	addMember,
	removeMember,
} = require('../controllers/chatGroupController');

router.post('/create', createChatGroup);
router.post('/add-member', addMember);
router.post('/remove-member', removeMember);

module.exports = router;
