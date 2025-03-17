const logger = {
	debug: (...args) => {
		if (process.env.NODE_ENV !== 'production') {
			console.debug(...args);
		}
	},
	info: (...args) => {
		if (process.env.NODE_ENV !== 'production') {
			console.info(...args);
		}
	},
	error: (...args) => {
		console.error(...args);
	},
};

export default logger;
