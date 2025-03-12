require('dotenv').config();
const express = require('express');
const path = require('path');
const sequelize = require('./config/database');
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const initializeSocketServer = require('./socketServer');
const errorHandler = require('./middlewares/errorHandler');
const setupSwagger = require('./swagger'); // Import Swagger setup

const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use('/chat', chatRoutes);
setupSwagger(app); // Setup Swagger
app.use(errorHandler);

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

sequelize
  .sync({ force: false })
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database error:', err));

const server = initializeSocketServer(app);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;