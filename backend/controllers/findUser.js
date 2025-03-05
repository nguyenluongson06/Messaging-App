const { Op } = require('sequelize');
const User = require('../models/User');
/**
 * Find user by username or uid as an URL parameter
 * URL example: example.com/auth/find?query={query}
 * @param {*} req request sent
 * @param {*} res response
 * @returns
 */
exports.findUser = async (req, res) => {
	try {
		const { query } = req.query.query;

		if (!query) {
			return res
				.status(400)
				.json({ message: 'Vui lòng nhập từ khóa tìm kiếm' });
		}

		const users = await User.findAll({
			where: {
				[Op.or]: [
					{ username: { [Op.like]: `%${query}%` } },
					{ uid: { [Op.like]: `%${query}%` } },
				],
			},
			attributes: { exclude: ['password'] },
		});

		if (users.length === 0) {
			return res.status(404).json({ message: 'Không tìm thấy người dùng' });
		}

		return res.status(200).json(users);
	} catch (error) {
		return res.status(500).json({
			message: 'Lỗi khi tìm kiếm người dùng',
			error: error.message,
		});
	}
};
