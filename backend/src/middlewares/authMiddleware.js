import jwt from "jsonwebtoken";

import messages from "../utils/messages.js";

const authMiddleware =(req,res,next)=>{
    try{
        const token = req.cookies.accessToken;

        if(!token){
            return res.status(401).json({success:false,message:messages.ACCESS_TOKEN_REQUIRED});
        }


        const decoded =jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );

        req.user = decoded

        next();
    }
    catch{
        return res.status(401).json({success:false,message:messages.INVALID_ACCESS_TOKEN});
    }
}

export default authMiddleware