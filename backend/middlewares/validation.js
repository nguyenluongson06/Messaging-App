const { body, validationResult } = require('express-validator');
const { User } = require('../models/User'); // Import model User
const bcrypt = require('bcrypt'); //bcrypt for password hashing

// Middleware handles validation errors
const validateRequest = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({ errors: errors.array() });
	}
	next();
};

// Validate email when registering (check if it's a valid email)
const validateEmail = body('email')
	.isEmail()
	.withMessage('Email không hợp lệ')
	.normalizeEmail();

// Validate username when registering (length between 6 and 20 characters, must be unique)
const validateUsername = body('username')
	.trim()
	.isLength({ min: 6, max: 20 })
	.withMessage('Username phải chứa từ 6 đến 20 ký tự')
	.custom(async (value) => {
		const existingUser = await User.findOne({ where: { username: value } });
		if (existingUser) {
			throw new Error('Username đã tồn tại');
		}
	});

// Validate password when registering (length at least 6 characters, must contain at least one number and one letter)
const validatePassword = body('password')
	.isLength({ min: 6 })
	.withMessage('Mật khẩu phải có ít nhất 6 ký tự')
	.matches(/\d/)
	.withMessage('Mật khẩu phải chứa ít nhất một số')
	.matches(/[a-zA-Z]/)
	.withMessage('Mật khẩu phải chứa ít nhất một chữ cái');

// Validate login (check if username and password are not empty)
const validateLogin = [
	body('username')
		.trim()
		.notEmpty()
		.withMessage('Username không được để trống'),
	body('password').notEmpty().withMessage('Mật khẩu không được để trống'),
	body(['username', 'password']).custom(async (value, { req }) => {
		const { username, password } = req.body;

		// check if user exists
		const user = await User.findOne({
			where: {
				[Op.or]: [{ username }, { email: username }], // Hỗ trợ đăng nhập bằng username hoặc email
			},
		});

		if (!user) {
			throw new Error('Username hoặc mật khẩu không chính xác');
		}

		// check if password is correct
		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) {
			throw new Error('Username hoặc mật khẩu không chính xác');
		}
	}),
];

// Validate message (length between 1 and 1000 characters)
const validateMessage = body('content')
	.trim()
	.isLength({ min: 1, max: 1000 })
	.withMessage('Tin nhắn phải từ 1 đến 1000 ký tự')
	.escape();

// Xuất các middleware
module.exports = {
	validateRequest,
	validateEmail,
	validateUsername,
	validatePassword,
	validateLogin,
	validateMessage,
};
