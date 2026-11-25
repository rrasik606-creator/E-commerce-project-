
import { body } from "express-validator";
import messages from "../utils/messages.js";

export const createProductValidator = [
    body("name")
        .isString().withMessage(messages.PRODUCT_NAME_REQUIRED)
        .bail()
        .trim()
        .notEmpty().withMessage(messages.PRODUCT_NAME_REQUIRED),

    body("brand")
        .isString().withMessage(messages.PRODUCT_BRAND_REQUIRED)
        .bail()
        .trim()
        .notEmpty().withMessage(messages.PRODUCT_BRAND_REQUIRED),

    body("category")
        .isIn(["men", "women"])
        .withMessage(messages.PRODUCT_CATEGORY_INVALID),

    body("type")
        .isString().withMessage(messages.PRODUCT_TYPE_REQUIRED)
        .bail()
        .trim()
        .notEmpty().withMessage(messages.PRODUCT_TYPE_REQUIRED),

    body("price")
        .isFloat({ min: 0 })
        .withMessage(messages.PRODUCT_PRICE_INVALID)
        .toFloat(),

    body("originalPrice")
        .isFloat({ min: 0 })
        .withMessage(messages.PRODUCT_ORIGINAL_PRICE_INVALID)
        .toFloat(),

    body("discount")
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage(messages.PRODUCT_DISCOUNT_INVALID)
        .toFloat(),

    body("rating")
        .optional()
        .isFloat({ min: 0, max: 5 })
        .withMessage(messages.PRODUCT_RATING_INVALID)
        .toFloat(),

    body("reviews")
        .optional()
        .isFloat({ min: 0 })
        .withMessage(messages.PRODUCT_REVIEWS_INVALID)
        .toFloat(),

    body("image")
        .isArray({ min: 1 })
        .withMessage(messages.PRODUCT_IMAGE_REQUIRED),

    body("image.*")
        .isString()
        .withMessage(messages.PRODUCT_IMAGE_REQUIRED)
        .bail()
        .trim()
        .notEmpty()
        .withMessage(messages.PRODUCT_IMAGE_REQUIRED),

    body("description")
        .isString()
        .withMessage(messages.PRODUCT_DESCRIPTION_REQUIRED)
        .bail()
        .trim()
        .notEmpty()
        .withMessage(messages.PRODUCT_DESCRIPTION_REQUIRED),

    body("features")
        .optional()
        .isArray()
        .withMessage(messages.PRODUCT_FEATURES_INVALID),

    body("features.*")
        .optional()
        .isString()
        .withMessage(messages.PRODUCT_FEATURES_INVALID),

    body("stock")
        .optional()
        .isFloat({ min: 0 })
        .withMessage(messages.PRODUCT_STOCK_INVALID)
        .toFloat(),

    body("featured")
        .optional()
        .isBoolean({ strict: true })
        .withMessage(messages.PRODUCT_FEATURED_INVALID),

    body("isNew")
        .optional()
        .isBoolean({ strict: true })
        .withMessage(messages.PRODUCT_IS_NEW_INVALID)
];

export const updateProductValidator = [
    body("name")
        .optional()
        .isString().withMessage(messages.PRODUCT_NAME_REQUIRED)
        .bail()
        .trim()
        .notEmpty().withMessage(messages.PRODUCT_NAME_REQUIRED),

    body("brand")
        .optional()
        .isString().withMessage(messages.PRODUCT_BRAND_REQUIRED)
        .bail()
        .trim()
        .notEmpty().withMessage(messages.PRODUCT_BRAND_REQUIRED),

    body("category")
        .optional()
        .isIn(["men", "women"])
        .withMessage(messages.PRODUCT_CATEGORY_INVALID),

    body("type")
        .optional()
        .isString().withMessage(messages.PRODUCT_TYPE_REQUIRED)
        .bail()
        .trim()
        .notEmpty().withMessage(messages.PRODUCT_TYPE_REQUIRED),

    body("price")
        .optional()
        .isFloat({ min: 0 })
        .withMessage(messages.PRODUCT_PRICE_INVALID)
        .toFloat(),

    body("originalPrice")
        .optional()
        .isFloat({ min: 0 })
        .withMessage(messages.PRODUCT_ORIGINAL_PRICE_INVALID)
        .toFloat(),

    body("discount")
        .optional()
        .isFloat({ min: 0, max: 100 })
        .withMessage(messages.PRODUCT_DISCOUNT_INVALID)
        .toFloat(),

    body("rating")
        .optional()
        .isFloat({ min: 0, max: 5 })
        .withMessage(messages.PRODUCT_RATING_INVALID)
        .toFloat(),

    body("reviews")
        .optional()
        .isFloat({ min: 0 })
        .withMessage(messages.PRODUCT_REVIEWS_INVALID)
        .toFloat(),

    body("image")
        .optional()
        .isArray({ min: 1 })
        .withMessage(messages.PRODUCT_IMAGE_REQUIRED),

    body("image.*")
        .optional()
        .isString()
        .withMessage(messages.PRODUCT_IMAGE_REQUIRED)
        .bail()
        .trim()
        .notEmpty()
        .withMessage(messages.PRODUCT_IMAGE_REQUIRED),

    body("description")
        .optional()
        .isString()
        .withMessage(messages.PRODUCT_DESCRIPTION_REQUIRED)
        .bail()
        .trim()
        .notEmpty()
        .withMessage(messages.PRODUCT_DESCRIPTION_REQUIRED),

    body("features")
        .optional()
        .isArray()
        .withMessage(messages.PRODUCT_FEATURES_INVALID),

    body("features.*")
        .optional()
        .isString()
        .withMessage(messages.PRODUCT_FEATURES_INVALID),

    body("stock")
        .optional()
        .isFloat({ min: 0 })
        .withMessage(messages.PRODUCT_STOCK_INVALID)
        .toFloat(),

    body("featured")
        .optional()
        .isBoolean({ strict: true })
        .withMessage(messages.PRODUCT_FEATURED_INVALID),

    body("isNew")
        .optional()
        .isBoolean({ strict: true })
        .withMessage(messages.PRODUCT_IS_NEW_INVALID)
];
