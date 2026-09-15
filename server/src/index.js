require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');

const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const siteRoutes = require('./routes/siteRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

const REQUIRED_ENV = ['MONGO_URI', 'JWT_SECRET'];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`[startup] Missing required environment variables: ${missing.join(', ')}`);
  console.error('[startup] Copy server/.env.example to server/.env and fill it in.');
  process.exit(1);
}

const app = express();

// Trust the first proxy hop (needed for correct client IPs behind a
// load balancer / platform like Render/Heroku - affects rate limiting).
app.set('trust proxy', 1);

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '100kb' }));
// Strips any keys starting with '$' or containing '.' from req.body/query/params
// to prevent MongoDB operator injection (e.g. { "email": { "$gt": "" } }).
app.use(mongoSanitize());

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', uptime: process.uptime() } });
});

app.use('/api/auth', authRoutes);
app.use('/api/sites', siteRoutes);
app.use('/api/users', require('./routes/userRoutes'));

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`[server] listening on port ${PORT}`));
  })
  .catch((err) => {
    console.error('[startup] Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
  

module.exports = app;
