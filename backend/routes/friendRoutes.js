const router = require('express').Router();
const { getFriends } = require('../controllers/friendController');
const { authenticateToken } = require('../middlewares/auth');

/**
 * @swagger
 * /friends:
 *   get:
 *     summary: Get the friend list of the current user
 *     tags: [Friends]
 *     responses:
 *       200:
 *         description: Friend list fetched successfully
 *       500:
 *         description: Error fetching friends
 */
router.get('/', authenticateToken, getFriends);

module.exports = router;
