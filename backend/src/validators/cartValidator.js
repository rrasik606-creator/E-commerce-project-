
import { body, param } from "express-validator";
import messages from "../utils/messages.js";

// Add product to cart
export const addToCartValidator = [
    body("productId")
        .isMongoId()
        .withMessage(messages.INVALID_PRODUCT_ID),

    body("quantity")
        .optional({ values: "undefined" })
        .isInt({ min: 1 })
        .withMessage(messages.INVALID_QUANTITY)
        .toInt()
];

// Update cart quantity
export const updateCartQuantityValidator = [
    param("productId")
        .isMongoId()
        .withMessage(messages.INVALID_PRODUCT_ID),

    body("quantity")
        .notEmpty()
        .withMessage(messages.INVALID_QUANTITY)
        .bail()
        .isInt({ min: 1 })
        .withMessage(messages.INVALID_QUANTITY)
        .toInt()
];

// Remove product from cart
export const removeFromCartValidator = [
    param("productId")
        .isMongoId()
        .withMessage(messages.INVALID_PRODUCT_ID)
];
