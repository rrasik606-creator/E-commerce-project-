import messages from "../utils/messages.js";

const roleMiddleware=(...Roles)=>{
    return (req,res,next)=>{
        if(!req.user){
            return res.status(401).json({success:false,message:messages.AUTHENTICATION_REQUIRED});
        }

        if(!Roles.includes(req.user.role)){
            return res.status(403).json({success:false,message:messages.PERMISSION_DENIED});
        }
        next();
    }
}

export default roleMiddleware