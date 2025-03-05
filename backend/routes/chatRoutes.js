const express = require('express');
const router = express.Router();
const { createChatGroup } = require('../controllers/chatGroupController');

router.post('/create', createChatGroup);

module.exports = router;
