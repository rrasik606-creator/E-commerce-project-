import mongoose from "mongoose";

import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";


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
            return res.status(400).json({success:false,message:"Invalid product ID"});
        }

        const product=await Product.findOne({_id:productId,deleted:{$ne:true}});

        if(!product){
            return res.status(404).json({success:false,message:"Product not found"});
        }

        let wishlist=await Wishlist.findOne({userId});

        if(!wishlist){
            wishlist=new Wishlist({userId,items:[]});
        }

        const existingItem=wishlist.items.find((item)=>item.productId.toString()===productId);

        if(existingItem){
            return res.status(200).json({success:true,message:"Product already exists in wishlist",wishlist:await wishlist.populate("items.productId")});
        }

        wishlist.items.push({productId});

        await wishlist.save();
        await wishlist.populate("items.productId");

        return res.status(200).json({success:true,message:"Product added to wishlist",wishlist});
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
            return res.status(400).json({success:false,message:"Invalid product ID"});
        }

        const wishlist=await Wishlist.findOne({userId});

        if(!wishlist){
            return res.status(404).json({success:false,message:"Wishlist not found"});
        }

        const initialLength=wishlist.items.length;

        wishlist.items=wishlist.items.filter((item)=>item.productId.toString()!==productId);

        if(wishlist.items.length===initialLength){
            return res.status(404).json({success:false,message:"Product not found in wishlist"});
        }

        await wishlist.save();
        await wishlist.populate("items.productId");

        return res.status(200).json({success:true,message:"Product removed from wishlist",wishlist});
    }
    catch(error){
        console.log("Remove Wishlist Error:",error);
        next(error);
    }
}