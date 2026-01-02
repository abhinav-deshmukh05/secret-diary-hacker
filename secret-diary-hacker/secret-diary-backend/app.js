require('dotenv').config();
const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const noteRoutes = require('./routes/note');
const authGuard = require('./middleware/Auth');

const app = express();

// 1️⃣ Connect DB
connectDB();

// 2️⃣ Global middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// 3️⃣ Routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', authGuard, noteRoutes);

// 4️⃣ Start server LAST
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
