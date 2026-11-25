import mongoose from "mongoose";

import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";
import messages from "../utils/messages.js";


export const getWishlist=async(req,res,next)=>{
    try{
        const userId=req.user.userId;

        const wishlist=await Wishlist.findOne({userId}).populate("items.productId");
        
        if(!wishlist){
            return res.status(200).json({success:true,wishlist:null});
        }
        return res.status(200).json({success:true,wishlist});
    }
    catch(error){
        console.log("Get Wishlist Error:",error);
        next(error);
    }
};

export const addToWishlist=async(req,res,next)=>{
    try{
        const userId=req.user.userId;
        const {productId}=req.body;

        if(!mongoose.isValidObjectId(productId)){
            return res.status(400).json({success:false,message:messages.INVALID_PRODUCT_ID});
        }

        const product=await Product.findOne({_id:productId,deleted:{$ne:true}});

        if(!product){
            return res.status(404).json({success:false,message:messages.PRODUCT_NOT_FOUND});
        }

        let wishlist=await Wishlist.findOne({userId});

        if(!wishlist){
            wishlist=new Wishlist({userId,items:[]});
        }

        const existingItem=wishlist.items.find((item)=>item.productId.toString()===productId);

        if(existingItem){
            return res.status(200).json({success:true,message:messages.PRODUCT_ALREADY_IN_WISHLIST,wishlist:await wishlist.populate("items.productId")});
        }

        wishlist.items.push({productId});

        await wishlist.save();
        await wishlist.populate("items.productId");

        return res.status(200).json({success:true,message:messages.PRODUCT_ADDED_TO_WISHLIST,wishlist});
    }
    catch(error){
        console.log("Add Wishlist Error:",error)
        next(error);
    }
};


export const removeFromWishlist=async(req,res,next)=>{
    try{
        const userId=req.user.userId;
        const {productId}=req.params;

        if(!mongoose.isValidObjectId(productId)){
            return res.status(400).json({success:false,message:messages.INVALID_PRODUCT_ID});
        }

        const wishlist=await Wishlist.findOne({userId});

        if(!wishlist){
            return res.status(404).json({success:false,message:messages.WISHLIST_NOT_FOUND});
        }

        const initialLength=wishlist.items.length;

        wishlist.items=wishlist.items.filter((item)=>item.productId.toString()!==productId);

        if(wishlist.items.length===initialLength){
            return res.status(404).json({success:false,message:messages.PRODUCT_NOT_FOUND_IN_WISHLIST});
        }

        await wishlist.save();
        await wishlist.populate("items.productId");

        return res.status(200).json({success:true,message:messages.PRODUCT_REMOVED_FROM_WISHLIST,wishlist});
    }
    catch(error){
        console.log("Remove Wishlist Error:",error);
        next(error);
    }
}