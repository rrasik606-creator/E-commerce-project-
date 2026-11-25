import {rateLimit } from "express-rate-limit";

import messages from "../utils/messages.js";

export const loginLimiter =rateLimit ({
    windowMs:15*60*1000,
    limit:5,
    message:{
        success:false,
        message:messages.TOO_MANY_LOGIN_ATTEMPTS
    },
    standardHeaders:"draft-8",
    legacyHeaders:false
});

export const registerLimiter =rateLimit ({
    windowMs:60*60*1000,
    limit:5,
    message:{
        success:false,
        message:messages.TOO_MANY_REGISTRATION_ATTEMPTS
    },
    standardHeaders:"draft-8",
    legacyHeaders:false
})