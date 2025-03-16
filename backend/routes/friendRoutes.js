const router = require('express').Router();
const { getFriends, addFriend } = require('../controllers/friendController');
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

/**
 * @swagger
 * /friends:
 *   post:
 *     summary: Add a friend
 *     tags: [Friends]
 *     responses:
 *       201:
 *         description: Friend added successfully
 *       500:
 *         description: Error adding friend
 */
router.post('/', authenticateToken, addFriend);

module.exports = router;
