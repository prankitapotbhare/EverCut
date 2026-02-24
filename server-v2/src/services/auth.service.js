import userRepository from '../repositories/user.repository.js';
import customerProfileRepo from '../repositories/customer-profile.repository.js';
import shopRepository from '../repositories/shop.repository.js';
import { ROLES } from '../utils/constants.js';
import { NotFoundError, ConflictError, BadRequestError } from '../utils/api-error.js';
import { hashPin, validatePinCreation } from './pin.service.js';

/**
 * Auth service — handles both Customer and Barber authentication flows.
 */

/**
 * Check whether the user exists after Firebase OTP verification.
 */
export const checkAfterOTP = async (firebaseUid, phoneNumber, roleType) => {
    const existingUser = await userRepository.findByFirebaseUid(firebaseUid);

    if (existingUser) {
        // Update last login timestamp
        await userRepository.updateLastLogin(existingUser._id);

        let profile = null;
        if (existingUser.roleType === ROLES.CUSTOMER) {
            profile = await customerProfileRepo.findByUserId(existingUser._id);
        } else if (existingUser.roleType === ROLES.BARBER) {
            profile = await shopRepository.findByOwnerId(existingUser._id);
        }

        return {
            isNewUser: false,
            user: existingUser,
            profile,
        };
    }

    // New user — needs to complete their profile
    return {
        isNewUser: true,
        firebaseUid,
        phoneNumber,
    };
};

/**
 * Complete customer profile (registration step 2).
 */
export const completeCustomerProfile = async (firebaseUid, profileData, file) => {
    // Check for existing user
    const existing = await userRepository.findByFirebaseUid(firebaseUid);
    if (existing) throw new ConflictError('User already exists');

    if (!file) throw new BadRequestError('Profile photo is required');

    // Parse location if string
    let location = profileData.location;
    if (location && typeof location === 'string') {
        try {
            location = JSON.parse(location);
        } catch {
            throw new BadRequestError('Invalid location format');
        }
    }

    // Create core identity
    const user = await userRepository.create({
        firebaseUid,
        phoneNumber: profileData.phoneNumber,
        email: profileData.email,
        roleType: ROLES.CUSTOMER,
    });

    // Create customer profile
    const profile = await customerProfileRepo.create({
        userId: user._id,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        gender: profileData.gender,
        dateOfBirth: profileData.dateOfBirth,
        address: profileData.address,
        location,
        photoUrl: file.path,
        cloudinaryId: file.filename || file.public_id,
    });

    return { user, profile };
};

/**
 * Complete barber profile (registration step 2).
 */
export const completeBarberProfile = async (firebaseUid, shopData) => {
    const existing = await userRepository.findByFirebaseUid(firebaseUid);
    if (existing) throw new ConflictError('Barber already exists');

    // Validate PIN
    const pinResult = validatePinCreation(shopData.pin, shopData.confirmPin);
    if (!pinResult.isValid) throw new BadRequestError(pinResult.message);

    const pinHash = await hashPin(shopData.pin);

    // Parse location if string
    let location = shopData.location;
    if (location && typeof location === 'string') {
        try {
            location = JSON.parse(location);
        } catch {
            throw new BadRequestError('Invalid location format');
        }
    }

    // Create core identity
    const user = await userRepository.create({
        firebaseUid,
        phoneNumber: shopData.phoneNumber,
        email: shopData.emailId,
        roleType: ROLES.BARBER,
    });

    // Create shop profile
    const shop = await shopRepository.create({
        ownerId: user._id,
        shopName: shopData.shopName,
        ownerName: shopData.shopOwner,
        category: shopData.shopCategory,
        phoneNumber: shopData.phoneNumber,
        emailId: shopData.emailId,
        upiId: shopData.upiId,
        bio: shopData.bio,
        address: shopData.address,
        location,
        numberOfEmployees: shopData.numberOfEmployees,
        yearsOfExperience: shopData.yearsOfExperience,
        facilities: shopData.facilities,
        availableDays: shopData.availableDays,
        openTime: shopData.openTime,
        closeTime: shopData.closeTime,
        breakTimes: shopData.breakTimes,
        pinHash,
    });

    return { user, shop };
};
