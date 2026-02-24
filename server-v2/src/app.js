import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import rateLimit from 'express-rate-limit';
import config from './config/index.js';
import routes from './routes/index.js';
import requestLogger from './middleware/request-logger.middleware.js';
import errorHandler from './middleware/error-handler.middleware.js';
import { ApiResponse } from './utils/api-response.js';

/**
 * Express application factory.
 *
 * Middleware stack order follows the Blueprint:
 *  1. Request Logger
 *  2. Security Headers (Helmet)
 *  3. Rate Limiting
 *  4. CORS
 *  5. Body Parser (with size limits)
 *  6. Data Sanitization (NoSQL injection, HTTP Parameter Pollution)
 *  7. Routes
 *  8. 404 handler
 *  9. Global error handler
 */
const createApp = () => {
    const app = express();

    // ── 1. Request logging ─────────────────────────────────────────────────
    app.use(requestLogger);

    // ── 2. Security headers ────────────────────────────────────────────────
    app.use(helmet());

    // ── 3. Rate limiting ───────────────────────────────────────────────────
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
        standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
        handler: (_req, res) => {
            res.status(429).json(ApiResponse.error('Too many requests, please try again later.', 429));
        },
    });
    // Apply the rate limiting middleware to all requests.
    // If you want to limit specific routes later, you can attach it only to those routes.
    app.use('/api', limiter);

    // ── 4. CORS ────────────────────────────────────────────────────────────
    app.use(
        cors({
            origin: config.env === 'production'
                ? process.env.ALLOWED_ORIGINS?.split(',') || []
                : '*',
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }),
    );

    // ── 5. Body parsing ────────────────────────────────────────────────────
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // ── 6. Data Sanitization ───────────────────────────────────────────────
    // Data sanitization against NoSQL query injection
    app.use(mongoSanitize());

    // Data sanitization against HTTP Parameter Pollution
    app.use(hpp());

    // ── 4. API routes ──────────────────────────────────────────────────────
    app.use(config.apiPrefix, routes);

    // ── 5. 404 catch-all ───────────────────────────────────────────────────
    app.use((_req, res) => {
        res.status(404).json(
            ApiResponse.error('Route not found', 404),
        );
    });

    // ── 6. Global error handler (must be last) ─────────────────────────────
    app.use(errorHandler);

    return app;
};

export default createApp;
