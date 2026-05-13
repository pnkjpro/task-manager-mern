const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { logger } = require('./middleware/logger');
const app = require('./app');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

module.exports = app;
