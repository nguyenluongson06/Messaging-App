const router = require('express').Router();
const {
	userRegister,
	userLogin,
	userLogout,
} = require('../controllers/authControllers');
const { findUser } = require('../controllers/findUser');
const { authenticateToken } = require('../middlewares/auth');
const rateLimiterMiddleware = require('../middlewares/rateLimiter');

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post('/signup', rateLimiterMiddleware, userRegister);

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       400:
 *         description: Bad request
 */
router.post('/signin', rateLimiterMiddleware, userLogin);

/**
 * @swagger
 * /auth/signout:
 *   post:
 *     summary: Logout a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.post('/signout', userLogout);

/**
 * @swagger
 * /auth/find:
 *   get:
 *     summary: Find a user
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query
 *     responses:
 *       200:
 *         description: User found
 *       400:
 *         description: Bad request
 *       404:
 *         description: User not found
 */
router.get('/find', authenticateToken, findUser);

module.exports = router;
