import { body, param } from "express-validator";

import messages from "../utils/messages.js";

export const createOrderValidator = [
    body("paymentMethod")
        .notEmpty()
        .withMessage(messages.INVALID_PAYMENT_METHOD)
        .bail()
        .isIn(["COD", "UPI", "Card"])
        .withMessage(messages.INVALID_PAYMENT_METHOD),

    body("address.name")
        .isString()
        .withMessage(messages.ADDRESS_NAME_REQUIRED)
        .bail()
        .trim()
        .notEmpty()
        .withMessage(messages.ADDRESS_NAME_REQUIRED),

    body("address.phone")
        .isString()
        .withMessage(messages.ADDRESS_PHONE_REQUIRED)
        .bail()
        .trim()
        .notEmpty()
        .withMessage(messages.ADDRESS_PHONE_REQUIRED),

    body("address.address")
        .isString()
        .withMessage(messages.ADDRESS_REQUIRED)
        .bail()
        .trim()
        .notEmpty()
        .withMessage(messages.ADDRESS_REQUIRED),

    body("address.city")
        .isString()
        .withMessage(messages.ADDRESS_CITY_REQUIRED)
        .bail()
        .trim()
        .notEmpty()
        .withMessage(messages.ADDRESS_CITY_REQUIRED),

    body("address.state")
        .isString()
        .withMessage(messages.ADDRESS_STATE_REQUIRED)
        .bail()
        .trim()
        .notEmpty()
        .withMessage(messages.ADDRESS_STATE_REQUIRED),

    body("address.pincode")
        .isString()
        .withMessage(messages.ADDRESS_PINCODE_REQUIRED)
        .bail()
        .trim()
        .notEmpty()
        .withMessage(messages.ADDRESS_PINCODE_REQUIRED)
];

// export const getSingleOrderValidator = [
//     param("orderId")
//         .isMongoId()
//         .withMessage(messages.INVALID_ORDER_ID)
// ];

export const cancelOrderValidator = [
    param("orderId")
        .isMongoId()
        .withMessage(messages.INVALID_ORDER_ID)
];

export const updateOrderStatusValidator = [
    param("id")
        .isMongoId()
        .withMessage(messages.INVALID_ORDER_ID),
    
    body("status")
        .notEmpty()
        .withMessage(messages.INVALID_ORDER_STATUS)
        .bail()
        .isIn([
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ])
        .withMessage(messages.INVALID_ORDER_STATUS)
];