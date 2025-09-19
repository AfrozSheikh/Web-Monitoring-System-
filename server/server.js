const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const logRoutes = require('./routes/logs');
const dashboardRoutes = require('./routes/dashboard');
const alertRoutes = require('./routes/alerts');

// Import alert checker
const { checkAlerts } = require('./utils/alertChecker');


const app = express();
// Serve the SDK file
app.get('/sdk.js', (req, res) => {
  res.setHeader('Content-Type', 'application/javascript');
  res.sendFile(path.join(__dirname, '../sdk/src/index.js'));

});

// Serve the test website
app.use('/test', express.static(path.join(__dirname, '../test-website')));

// Middleware
app.use(helmet());
// Dynamic origin allowing all requests with credentials
app.use(cors({
    origin: function(origin, callback){
      // origin == undefined matlab request postman ya server-side se aayi
      callback(null, origin || true);
    },
    credentials: true
  }));

// app.use(cors({
//   origin: "*",
//   credentials: true
// }));
app.use(express.json({ limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Higher rate limit for logs endpoint (SDK needs to send frequent data)
const logLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100 // 100 requests per minute
});
app.use('/api/logs', logLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/alerts', alertRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  
  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    
    // Start alert checking interval (every 5 minutes)
    setInterval(checkAlerts, 5 * 60 * 1000);
  });
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});