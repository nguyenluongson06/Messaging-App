const express = require('express');
const router = express.Router();
const {
	createChatGroup,
	updateMemberInGroup,
	addMember,
	removeMember,
} = require('../controllers/chatGroupController');

router.post('/create', createChatGroup);
router.put('/updateMemberInGroup', updateMemberInGroup)
router.post('/add-member', addMember);
router.post('/remove-member', removeMember);

module.exports = router;
