require('dotenv').config();
const express = require('express');
const db = require('./config/database');

//TODO: routing
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

const initializeSocketServer = require('./socketServer');

const app = express();
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);

// Kết nối database
db.sync().then(() => console.log('Database connected!'));

// Khởi động WebSocket server
const server = initializeSocketServer(app);
server.listen(3000, () => console.log('Server running on port 3000'));
