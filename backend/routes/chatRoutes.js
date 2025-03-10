const express = require('express');
const router = express.Router();
const {
	createChatGroup,
	updateMemberInGroup,
	addMember,
	removeMember,
} = require('../controllers/chatGroupController');
const { authenticateToken, isGroupOwner } = require('../middlewares/auth');
const {
	validateGroupCreation,
	validateGroupMemberOperation,
} = require('../middlewares/validation');

/**
 * @swagger
 * /chat/create:
 *   post:
 *     summary: Create a new chat group
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Chat group created successfully
 *       400:
 *         description: Bad request
 */
router.post(
	'/create',
	authenticateToken,
	validateGroupCreation,
	createChatGroup,
);

/**
 * @swagger
 * /chat/updateMemberInGroup:
 *   put:
 *     summary: Update a member in a chat group
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               group_id:
 *                 type: string
 *               user_id:
 *                 type: string
 *               role:
 *                 type: string
 *               alias:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member updated successfully
 *       400:
 *         description: Bad request
 */
router.put(
	'/updateMemberInGroup',
	authenticateToken,
	isGroupOwner,
	validateGroupMemberOperation,
	updateMemberInGroup,
);

/**
 * @swagger
 * /chat/add-member:
 *   post:
 *     summary: Add a member to a chat group
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               group_id:
 *                 type: string
 *               user_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Member added successfully
 *       400:
 *         description: Bad request
 */
router.post(
	'/add-member',
	authenticateToken,
	isGroupOwner,
	validateGroupMemberOperation,
	addMember,
);

/**
 * @swagger
 * /chat/remove-member:
 *   post:
 *     summary: Remove a member from a chat group
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               group_id:
 *                 type: string
 *               user_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Member removed successfully
 *       400:
 *         description: Bad request
 */
router.post(
	'/remove-member',
	authenticateToken,
	isGroupOwner,
	validateGroupMemberOperation,
	removeMember,
);

module.exports = router;
