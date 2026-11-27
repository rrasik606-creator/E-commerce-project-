import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import messages from "../utils/messages.js";



//Products
export const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find();

        return res.status(200).json({
            success: true,
            count: products.length,
            products
        });
    }
    catch (error) {
        console.error("ADMIN GET ALL PRODUCTS ERROR:", error);
        next(error);
    }
};

export const createProduct = async(req,res,next) => {
    try{
        const product = await Product.create(req.body);

        return res.status(201).json({
            success:true,
            message:messages.PRODUCT_CREATED,
            product
        });
    }
    catch(error){
        console.log("ADMIN CREATE PRODUCT ERROR:", error);
        next(error);
    }
};


export const updateProduct = async (req,res,next) => {
    try{
        const {id} =req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success:false,
                message:messages.INVALID_PRODUCT_ID
            });
        }

        const product = await Product.findOneAndUpdate(
            {_id:id,deleted:false},
            {$set:req.body},
            {new:true,runValidators:true}
        )

        if(!product){
            return res.status(404).json({
                success:false,
                message:messages.PRODUCT_NOT_FOUND
            })
        }

        return res.status(200).json({
            success:true,
            message:messages.PRODUCT_UPDATED,
            product
        });
    }
    catch(error){
        console.log("ADMIN UPDATE PRODUCT ERROR:",error);
        next(error);
    }
};


export const temporaryDeleteProduct = async(req,res,next) => {
    try{
        const {id} =req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success:false,
                message:messages.INVALID_PRODUCT_ID
            })
        }

        const product= await Product.findOneAndUpdate(
            {_id:id,deleted:false},
            {$set:{deleted:true}},
            {new:true}
        );

        if(!product){
            return res.status(404).json({
                success:false,
                message:messages.PRODUCT_NOT_FOUND
            })
        }

        return res.status(200).json({
            success:true,
            message:messages.PRODUCT_DELETED,
            product
        })
    }
    catch(error){
        console.log("ADMIN DELETE PRODUCT ERROR:",error);
        next(error)
    }
};


export const permanentDeleteProduct = async(req,res,next) => {
    try{
        const {id} =req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success:false,
                message:messages.INVALID_PRODUCT_ID
            })
        }

        const product = await Product.findOneAndDelete({_id:id,deleted:true});

        if(!product){
            return res.status(404).json({
                success:false,
                message:messages.PRODUCT_NOT_FOUND
            });
        }

        return res.status(200).json({
            success:true,
            message:messages.PRODUCT_PERMANENTLY_DELETED
        });
    }
    catch(error){
        console.log("ADMIN PERMANENT DELETE PRODUCT ERROR:",error);
        next(error)
    }
}

export const restoreProduct = async (req,res,next) => {
    try{
        const {id} =req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success:false,
                message:messages.INVALID_PRODUCT_ID
            });
        }

        const product = await Product.findOneAndUpdate(
            {_id:id,deleted:true},
            {$set:{deleted:false}},
            {new:true}
        );

        if(!product){
            return res.status(404).json({
                success:false,
                message:messages.PRODUCT_NOT_FOUND
            })
        }

        return res.status(200).json({
            success:true,
            message:messages.PRODUCT_RESTORED,
            product
        });
    }
    catch(error){
        console.log("ADMIN RESTORE PRDUCT ERROR:",error);
        next(error);
    }
};


//Order
export const getAllOrders = async(req,res,next) =>{
    try{
        const orders= await Order.find()
            .populate("userId","name username email")
            .sort({createdAt:-1});

        return res.status(200).json({
            success:true,
            count:orders.length,
            orders
        });    
    }
    catch(error){
        console.log("ADMIN GET ALL ORDERS ERROR:",error);
        next(error);
    }
};

export const updateOrderStatus = async(req,res,next) =>{
    const {id} =req.params;
    const {status} =req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            success:false,
            message:messages.INVALID_ORDER_ID
        });
    }

    const validStatuses = [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled"
    ];

    if(!validStatuses.includes(status)){
        return res.status(400).json({
            success:false,
            message:messages.INVALID_ORDER_STATUS
        });
    }

    const allowedTransitions = {
        Pending:["Processing","Cancelled"],
        Processing:["Shipped","Cancelled"],
        Shipped:["Delivered"],
        Delivered:[],
        Cancelled:[]
    };

    let session;


    try{
        session = await mongoose.startSession();

        let updatedOrder;

        await session.withTransaction(async()=>{
            const order = await Order.findById(id).session(session);

            if(!order){
                const error = new Error(messages.ORDER_NOT_FOUND);
                error.statusCode=404;
                throw error;
            }
            if(!allowedTransitions[order.status]?.includes(status)){
                const error = new Error(messages.ORDER_STATUS_CANNOT_BE_UPDATED);
                error.statusCode=400;
                throw error;
            }

            if(status==="Cancelled"){
                for(const item of order.items){
                    await Product.updateOne(
                        {_id:item.productId},
                        {$inc:{stock:item.quantity}},
                        {session}
                    );
                }
            }

            order.status = status;

            await order.save({ session });

            updatedOrder = order;
        });

        await updatedOrder.populate("userId","name username email");

        return res.status(200).json({
            success:true,
            message:messages.ORDER_STATUS_UPDATED,
            order:updatedOrder
        });
    }
    catch(error){
        console.log("ADMIN UPDATE ORDER STATUS ERROR:",error);
        next(error);
    }
    finally{
        if(session){
        await session.endSession();
        }
    }
};

//User
export const getAllUsers = async(req,res,next) =>{
    try{
        const users = await User.find().select("-password").sort({createdAt:-1});

        return res.status(200).json({
            success:true,
            count:users.length,
            users
        });
    }
    catch(error){
        console.log("ADMIN USER GETING ERROR:",error);
        next(error);
    }
};

export const blockUser = async(req,res,next) => {
    try{
        const {id} =req.params;

        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({
                success:false,
                message:messages.USER_NOT_FOUND
            });
        }

        if(user.role==="admin"){
            return res.status(403).json({
                success:false,
                message:messages.CANNOT_BLOCK_ADMIN
            });
        }
        if(user._id.toString()===req.user.userId){
            return res.status(400).json({
                success:false,
                message:messages.CANNOT_BLOCK_SELF
            });
        }
        if(user.blocked){
            return res.status(400).json({
                success:false,
                message:messages.USER_ALREADY_BLOCKED
            });
        }

        user.blocked=true;
        await user.save();

        return res.status(200).json({
            success:true,
            message:messages.USER_BLOCKED
        });
    }
    catch(error){
        console.log("ADMIN BLOCK USER ERROR:",error);
        next(error);
    }
}

export const unblockUser = async(req,res,next) =>{
    try{
        const {id} =req.params;

        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({
                success:false,
                message:messages.USER_NOT_FOUND
            });
        }
        if(!user.blocked){
            return res.status(400).json({
                success:false,
                message:messages.USER_ALREADY_UNBLOCKED
            });
        }

        user.blocked=false
        await user.save();

        return res.status(200).json({
            success:true,
            message:messages.USER_UNBLOCKED
        });
    }
    catch(error){
        console.log("ADMIN UNBLOCK USER ERROR:",error);
        next(error);
    }
}