import * as authService from '../services/auth.service.js';
import { ApiResponse } from '../utils/api-response.js';

/**
 * Auth controller — handles both Customer and Barber auth flows.
 */

export const checkAfterOTP = async (req, res, next) => {
    try {
        const { firebaseUid, phoneNumber } = req.user;
        const { roleType } = req.body;

        const result = await authService.checkAfterOTP(firebaseUid, phoneNumber, roleType);

        if (result.isNewUser) {
            return res.status(200).json(
                ApiResponse.success(
                    { isNewUser: true, firebaseUid: result.firebaseUid, phoneNumber: result.phoneNumber },
                    'New user. Please complete your profile.',
                ),
            );
        }

        return res.status(200).json(
            ApiResponse.success(
                { isNewUser: false, user: result.user, profile: result.profile },
                'Login successful',
            ),
        );
    } catch (err) {
        next(err);
    }
};

export const completeCustomerProfile = async (req, res, next) => {
    try {
        const { firebaseUid } = req.user;
        const result = await authService.completeCustomerProfile(firebaseUid, req.body, req.file);
        return res.status(201).json(ApiResponse.success(result, 'Customer profile created'));
    } catch (err) {
        next(err);
    }
};

export const completeBarberProfile = async (req, res, next) => {
    try {
        const { firebaseUid } = req.user;
        const result = await authService.completeBarberProfile(firebaseUid, req.body);
        return res.status(201).json(ApiResponse.success(result, 'Barber profile created'));
    } catch (err) {
        next(err);
    }
};
