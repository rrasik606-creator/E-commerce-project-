
import { body } from "express-validator";
import messages from "../utils/messages.js";

export const registerValidator = [
    body("name")
        .isString()
        .withMessage(messages.NAME_REQUIRED)
        .bail()
        .trim()
        .notEmpty()
        .withMessage(messages.NAME_REQUIRED),

    body("username")
        .isString()
        .withMessage(messages.USERNAME_REQUIRED)
        .bail()
        .trim()
        .notEmpty()
        .withMessage(messages.USERNAME_REQUIRED),

    body("email")
        .isString()
        .withMessage(messages.EMAIL_REQUIRED)
        .bail()
        .trim()
        .notEmpty()
        .withMessage(messages.EMAIL_REQUIRED)
        .bail()
        .isEmail()
        .withMessage(messages.INVALID_EMAIL),

    body("password")
        .isString()
        .withMessage(messages.PASSWORD_REQUIRED)
        .bail()
        .notEmpty()
        .withMessage(messages.PASSWORD_REQUIRED)
        .bail()
        .isLength({ min: 8 })
        .withMessage(messages.PASSWORD_MIN_LENGTH)
];

export const loginValidator = [
    body("email")
        .isString()
        .withMessage(messages.EMAIL_REQUIRED)
        .bail()
        .trim()
        .notEmpty()
        .withMessage(messages.EMAIL_REQUIRED)
        .bail()
        .isEmail()
        .withMessage(messages.INVALID_EMAIL),

    body("password")
        .isString()
        .withMessage(messages.PASSWORD_REQUIRED)
        .bail()
        .notEmpty()
        .withMessage(messages.PASSWORD_REQUIRED)
];
