const express = require('express');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');

const initializeSocketServer = require('./socketServer');

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);

sequelize.sync({ force: false })
    .then(() => console.log('Database connected'))
    .catch(err => console.error('Database error:', err));

const server = initializeSocketServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));