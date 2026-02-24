import Joi from 'joi';
import { objectId } from './common.validator.js';

export const addRatingSchema = Joi.object({
    shopId: objectId.required(),
    rating: Joi.number().integer().min(1).max(5).required(),
    review: Joi.string().trim().max(500).allow(''),
});
