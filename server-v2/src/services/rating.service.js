import ratingRepository from '../repositories/rating.repository.js';
import shopRepository from '../repositories/shop.repository.js';
import { NotFoundError, BadRequestError, ConflictError } from '../utils/api-error.js';

/**
 * Rating service.
 */

export const addRating = async (customerId, shopId, rating, review) => {
    if (!shopId || !rating) throw new BadRequestError('shopId and rating are required');

    const shop = await shopRepository.findById(shopId);
    if (!shop) throw new NotFoundError('Shop');

    const existing = await ratingRepository.findByCustomerAndShop(customerId, shopId);
    if (existing) throw new ConflictError('You have already rated this shop');

    return ratingRepository.create({ customerId, shopId, rating, review });
};

export const getRatingsByShop = async (shopId) => {
    const ratings = await ratingRepository.findByShop(shopId);
    return ratings.map((r) => ({
        ratingId: r._id,
        rating: r.rating,
        review: r.review,
        user: {
            firstName: r.customerId?.firstName || 'Unknown',
            lastName: r.customerId?.lastName || '',
            email: r.customerId?.email || null,
        },
        createdAt: r.createdAt,
    }));
};

export const getRatingSummary = async (shopId) => {
    return ratingRepository.getShopSummary(shopId);
};

export const removeRating = async (ratingId, ownerId) => {
    const rating = await ratingRepository.findById(ratingId);
    if (!rating) throw new NotFoundError('Rating');

    // Verify the barber owns the shop this rating belongs to
    const shop = await shopRepository.findByOwnerId(ownerId);
    if (!shop || rating.shopId.toString() !== shop._id.toString()) {
        throw new BadRequestError('You can only remove ratings on your own shop');
    }

    await ratingRepository.deleteById(ratingId);
    return { message: 'Rating deleted successfully' };
};
