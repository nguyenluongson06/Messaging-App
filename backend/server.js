require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const friendRoutes = require('./routes/friendRoutes'); // Import friend routes
const initializeSocketServer = require('./socketServer');
const errorHandler = require('./middlewares/errorHandler');
const setupSwagger = require('./swagger');
const {
	User,
	ChatGroup,
	GroupMember,
	Message,
	UserKey,
	Friend,
} = require('./models/sync');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
app.use('/friends', friendRoutes); // Add friend routes
setupSwagger(app);
app.use(errorHandler);

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// Catch-all handler to serve the index.html file for any unknown routes
app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

sequelize
	.sync({ force: false })
	.then(() => console.log('Database connected'))
	.catch((err) => console.error('Database error:', err));

const server = initializeSocketServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
