const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.registerUser = async (req, res) => {
	try {
		const { username, email, password } = req.body;

		const existingUser = await User.findOne({ where: { email } });
		if (existingUser) {
			return res.status(400).json({ message: 'Email đã được sử dụng' });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await User.create({ username, email, password: hashedPassword });

		return res.status(201).json({ message: 'Đăng ký thành công', user: newUser });
	} catch (error) {
		return res.status(500).json({ message: 'Đăng ký thất bại', error: error.message });
	}
};