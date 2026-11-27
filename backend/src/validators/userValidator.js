import { param } from "express-validator";

import messages from "../utils/messages.js";

export const getSingleUserValidator =[
    param("id")
        .isMongoId()
        .withMessage(messages.INVALID_USER_ID)
];