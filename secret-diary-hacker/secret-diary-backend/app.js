require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const authGuard = require('./middleware/Auth');
const authRoutes = require('./routes/auth');
const app = express();

// connect DB FIRST
connectDB();

app.use(express.json());

app.use('/api/signup',authRoutes);
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
