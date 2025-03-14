const validator = require('validator');
const { User } = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.userRegister = async (req, res) => {
	const { userName, email, password } = req.body;
	const error = [];
	if (!userName) {
		error.push('Vui lòng cung cấp tên người dùng');
	}
	if (!email) {
		error.push('Vui lòng cung cấp email');
	}
	if (email && !validator.isEmail(email)) {
		error.push('Vui lòng cung cấp email hợp lệ');
	}
	if (!password) {
		error.push('Vui lòng cung cấp mật khẩu');
	}
	if (password && password.length < 6) {
		error.push('Mật khẩu phải có ít nhất 6 ký tự');
	}
	if (error.length > 0) {
		return res.status(400).json({
			error: {
				errorMessage: error,
			},
		});
	}

	try {
		const checkUser = await User.findOne({ where: { email: email } });
		if (checkUser) {
			return res.status(404).json({
				error: {
					errorMessage: ['Email đã tồn tại'],
				},
			});
		}

		const userCreate = await User.create({
			userName,
			email,
			password: await bcrypt.hash(password, 10),
		});

		const token = jwt.sign(
			{
				id: userCreate.id,
				email: userCreate.email,
				userName: userCreate.userName,
				registerTime: userCreate.createdAt,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: process.env.TOKEN_EXP,
			},
		);

		const options = {
			expires: new Date(
				Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000,
			),
		};

		return res.status(201).cookie('authToken', token, options).json({
			successMessage: 'Đăng ký thành công',
			token,
		});
	} catch (error) {
		return res.status(500).json({
			error: {
				errorMessage: ['Lỗi máy chủ nội bộ'],
			},
		});
	}
};

module.exports.userLogin = async (req, res) => {
	const error = [];
	const { email, password } = req.body;
	if (!email) {
		error.push('Vui lòng cung cấp email');
	}
	if (!password) {
		error.push('Vui lòng cung cấp mật khẩu');
	}
	if (email && !validator.isEmail(email)) {
		error.push('Vui lòng cung cấp email hợp lệ');
	}
	if (error.length > 0) {
		return res.status(400).json({
			error: {
				errorMessage: error,
			},
		});
	}

	try {
		const checkUser = await User.findOne({ where: { email: email } });
		if (checkUser) {
			const matchPassword = await bcrypt.compare(password, checkUser.password);
			if (matchPassword) {
				const token = jwt.sign(
					{
						id: checkUser.id,
						email: checkUser.email,
						userName: checkUser.userName,
						registerTime: checkUser.createdAt,
					},
					process.env.JWT_SECRET,
					{
						expiresIn: process.env.TOKEN_EXP,
					},
				);

				const options = {
					expires: new Date(
						Date.now() + process.env.COOKIE_EXP * 24 * 60 * 60 * 1000,
					),
				};

				return res.status(200).cookie('authToken', token, options).json({
					successMessage: 'Đăng nhập thành công',
					token,
				});
			} else {
				return res.status(400).json({
					error: {
						errorMessage: ['Mật khẩu không hợp lệ'],
					},
				});
			}
		} else {
			return res.status(400).json({
				error: {
					errorMessage: ['Email không tồn tại'],
				},
			});
		}
	} catch {
		return res.status(404).json({
			error: {
				errorMessage: ['Lỗi máy chủ nội bộ'],
			},
		});
	}
};

module.exports.userLogout = (req, res) => {
	res.status(200).cookie('authToken', '').json({
		success: true,
	});
};
