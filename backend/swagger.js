const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Messaging App API',
			version: '1.0.0',
			description: 'API documentation for the Messaging App',
		},
		servers: [
			{
				url: 'http://localhost:3000/api',
			},
		],
	},
	apis: ['./routes/*.js', './controllers/*.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);

module.exports = (app) => {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
};
