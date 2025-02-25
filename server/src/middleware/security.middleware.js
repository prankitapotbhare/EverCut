import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import xss from 'xss-clean';
import hpp from 'hpp';

export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later'
});

export const securityMiddleware = [
  helmet(), // Set security HTTP headers
  xss(), // Sanitize inputs
  hpp(), // Prevent HTTP Parameter Pollution
];