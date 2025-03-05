const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models/User');
const { validationResult } = require('express-validator');
const {
	validateRequest,
	validateEmail,
	validateUsername,
	validatePassword,
	validateLogin,
} = require('../middlewares/validation');
const { rateLimiter } = require('../middlewares/rateLimiter');

// Sign up
exports.signup = [
	validateEmail,
	validateUsername,
	validatePassword,
	validateRequest,
	async (req, res) => {
		try {
			const { email, username, password } = req.body;
			const hashedPassword = await bcrypt.hash(password, 10);
			const newUser = await User.create({
				email,
				username,
				password: hashedPassword,
			});
			res
				.status(201)
				.json({ message: 'User registered successfully', user: newUser });
		} catch (error) {
			res
				.status(500)
				.json({ message: 'Error registering user', error: error.message });
		}
	},
];

// Sign in
exports.signin = [
	validateLogin,
	validateRequest,
	rateLimiter,
	async (req, res) => {
		try {
			const { username, password } = req.body;
			const user = await User.findOne({ where: { username } });
			if (!user)
				return res.status(400).json({ message: 'Invalid credentials' });

			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch)
				return res.status(400).json({ message: 'Invalid credentials' });

			const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
				expiresIn: '1h',
			});
			res.status(200).json({ message: 'Login successful', token });
		} catch (error) {
			res
				.status(500)
				.json({ message: 'Error logging in', error: error.message });
		}
	},
];

// Sign out
exports.signout = (req, res) => {
	res.status(200).json({ message: 'Sign out successful' });
};
