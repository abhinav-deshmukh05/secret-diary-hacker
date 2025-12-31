require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');

const authGuard = require('./middleware/Auth');
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/note');
const app = express();

// connect DB FIRST
connectDB();

app.use(express.json());

app.use('/api/auth',authRoutes);
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
app.use('/api/notes',noteRoutes);