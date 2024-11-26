const express = require('express');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const MySQLStore = require('express-mysql-session')(session);
const db = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const notesRoutes = require('./routes/notesRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration: Allow only the frontend domain and allow credentials
const corsOptions = {
  origin: 'http://localhost:3000',  // Allow only the frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'],  // Allow specific headers
  credentials: true,  // Allow cookies to be sent with requests
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
app.use(helmet()); // Security headers
app.use(morgan('dev')); // Logging

// MySQL session store
const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
  })
);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notes', notesRoutes);

// 404 Not Found Middleware
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
