const { RateLimiterMemory } = require('rate-limiter-flexible');
const { error } = require('winston');
const logger = require('../logger');

const rateLimiter = new RateLimiterMemory({
	points: 10, // 10 attempts
	duration: 180, // per 3 minutes
	blockDuration: 300, // block for 5 minutes
});

const rateLimiterMiddleware = (req, res, next) => {
	rateLimiter
		.consume(req.body.username)
		.then(() => {
			next();
		})
		.catch(() => {
			logger.error(`Rate limit exceeded for ${req.body.username}`);
			res.status(429).json({
				error: {
					errorMessage: 'Bạn đã thao tác quá nhiều lần, hãy thử lại sau',
				},
			});
		});
};

module.exports = rateLimiterMiddleware;
