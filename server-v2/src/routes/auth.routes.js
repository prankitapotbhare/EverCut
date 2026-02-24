import { Router } from 'express';
import authenticate from '../middleware/authenticate.middleware.js';
import { uploadCustomerPhoto } from '../middleware/upload.middleware.js';
import * as authController from '../controllers/auth.controller.js';

const router = Router();

/**
 * POST /api/v1/auth/check-after-otp
 * Check if user exists after Firebase OTP verification.
 */
router.post('/check-after-otp', authenticate, authController.checkAfterOTP);

/**
 * POST /api/v1/auth/complete-profile/customer
 * Complete customer registration (with photo upload).
 */
router.post(
    '/complete-profile/customer',
    authenticate,
    uploadCustomerPhoto,
    authController.completeCustomerProfile,
);

/**
 * POST /api/v1/auth/complete-profile/barber
 * Complete barber/shop registration.
 */
router.post(
    '/complete-profile/barber',
    authenticate,
    authController.completeBarberProfile,
);

export default router;
