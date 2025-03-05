const { RateLimiterMemory } = require('rate-limiter-flexible');

const rateLimiter = new RateLimiterMemory({
	points: 5, // 5 attempts
	duration: 300, // per 5 minutes
	blockDuration: 300, // block for 5 minutes
});

const rateLimiterMiddleware = (req, res, next) => {
	rateLimiter
		.consume(req.body.username)
		.then(() => {
			next();
		})
		.catch(() => {
			res
				.status(429)
				.json({ message: 'Bạn đã đăng nhập quá nhiều lần, hãy thử lại sau' });
		});
};

module.exports = rateLimiterMiddleware;
