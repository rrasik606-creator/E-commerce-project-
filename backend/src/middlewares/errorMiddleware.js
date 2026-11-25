import messages from "../utils/messages.js";

const errorMiddleware=(error,req,res,next)=>{

    const statusCode = error.statusCode || 500;

    res.status(statusCode).json({success:false,message:error.message||messages.INTERNAL_SERVER_ERROR});
}

export default errorMiddleware