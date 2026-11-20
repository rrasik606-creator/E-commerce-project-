import {rateLimit } from "express-rate-limit";

export const loginLimiter =rateLimit ({
    windowMs:15*60*1000,
    limit:5,
    message:{
        success:false,
        message:"Too many login attempts. Please try again after 15 minutes."
    },
    standardHeaders:"draft-8",
    legacyHeaders:false
});

export const registerLimiter =rateLimit ({
    windowMs:60*60*1000,
    limit:5,
    message:{
        success:false,
        message:"Too many registration attempts. Please try again later."
    },
    standardHeaders:"draft-8",
    legacyHeaders:false
})