import { body, param } from "express-validator";

import messages from "../utils/messages.js";

export const addToWishlistValidator = [
    body("productId")
        .notEmpty()
        .withMessage(messages.INVALID_PRODUCT_ID)
        .bail()
        .isMongoId()
        .withMessage(messages.INVALID_PRODUCT_ID)
];

export const removeFromWishlistValidator = [
    param("productId")
        .isMongoId()
        .withMessage(messages.INVALID_PRODUCT_ID)
];