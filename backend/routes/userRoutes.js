const express = require('express');
const router = express.Router();
const { searchUsers } = require('../controllers/userController');
const { authenticateToken } = require('../middlewares/auth');

router.get('/search', authenticateToken, searchUsers);

module.exports = router;
