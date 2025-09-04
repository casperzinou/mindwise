// Rate limiting middleware
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes default
  max: parseInt(process.env.RATE_LIMIT_MAX || '100'), // limit each IP to 100 requests per windowMs
  message: process.env.RATE_LIMIT_MESSAGE || 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});