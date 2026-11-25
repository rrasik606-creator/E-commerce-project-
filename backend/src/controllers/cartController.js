import mongoose from "mongoose";

import Cart from "../models/Cart.js";
import Product from "../models/Product.js";
import messages from "../utils/messages.js";

export const getCart=async(req,res,next)=>{
    try{
        const userId=req.user.userId;

        const cart= await Cart.findOne({userId}).populate("items.productId");

        if(!cart){
            return res.status(200).json({success:true,cart:null});
        }
        return res.status(200).json({success:true,cart,});
    }
    catch(error){
        console.log("Get Cart Error:",error);
        next(error);
    }
}

export const addTocart=async(req,res,next)=>{
    try{
        const userId=req.user.userId;
        const {productId,quantity=1}=req.body;

        if(!mongoose.isValidObjectId(productId)){
            return res.status(400).json({success:false,message:messages.INVALID_PRODUCT_ID});
        }
        if(!Number.isInteger(quantity)||quantity<1){
            return res.status(400).json({success:false,message:messages.INVALID_QUANTITY});
        }

        const product=await Product.findOne({_id:productId,deleted:{$ne:true}});

        if(!product){
            return res.status(404).json({success:false,message:messages.PRODUCT_NOT_FOUND});
        }

        if(product.stock<1){
            return res.status(400).json({success:false,message:messages.PRODUCT_OUT_OF_STOCK});
        }

        let cart=await Cart.findOne({userId});

        if(!cart){
            cart=new Cart({userId,items:[]});
        }

        const existingItem= cart.items.find((item)=>item.productId.toString()===productId);

        if(existingItem){
            const newQuantity =existingItem.quantity+quantity

            if(newQuantity>product.stock){
                return res.status(400).json({success:false,message:messages.STOCK_LIMIT_EXCEEDED.replace("{stock}",product.stock)})
            }

            existingItem.quantity=newQuantity;
        }
        else{
            if(quantity>product.stock){
                return res.status(400).json({success:false,message:messages.STOCK_LIMIT_EXCEEDED.replace("{stock}",product.stock)});
            }

            cart.items.push({productId,quantity});
        }    

        await cart.save();

        await cart.populate("items.productId");

        return res.status(200).json({success:true,message:messages.PRODUCT_ADDED_TO_CART,cart});
    }
    catch(error){
        console.log("Addto Cart Error:",error);
        next(error);
    }
};

export const updateCartQuantity=async(req,res,next)=>{
    try{
        const userId=req.user.userId;
        const {productId}=req.params;
        const {quantity}=req.body;

        if(!mongoose.isValidObjectId(productId)){
            return res.status(400).json({success:false,message:messages.INVALID_PRODUCT_ID});
        }
        if(!Number.isInteger(quantity)||quantity<1){
            return res.status(400).json({success:false,message:messages.INVALID_QUANTITY});
        }

        const cart=await Cart.findOne({userId});

        if(!cart){
            return res.status(404).json({success:false,message:messages.CART_NOT_FOUND});
        }

        const cartItem=cart.items.find((item)=>item.productId.toString()===productId);

        if(!cartItem){
            return res.status(404).json({success:false,message:messages.PRODUCT_NOT_FOUND_IN_CART});
        }

        const product=await Product.findOne({_id:productId,deleted:{$ne:true}});

        if(!product){
            return res.status(404).json({success:false,message:messages.PRODUCT_NOT_FOUND});
        }

        if(quantity>product.stock){
            return res.status(400).json({success:false,message:messages.STOCK_LIMIT_EXCEEDED.replace("{stock}",product.stock)})
        }

        cartItem.quantity=quantity;

        await cart.save();
        await cart.populate("items.productId");

        return res.status(200).json({success:true,message:messages.CART_QUANTITY_UPDATED,cart});
    }
    catch(error){
        console.log("Update quantity error:",error);
        next(error)
    }
};


export const removeFromCart=async(req,res,next)=>{
    try{
        const userId=req.user.userId;
        const {productId}=req.params;

        if(!mongoose.isValidObjectId(productId)){
            return res.status(400).json({success:false,message:messages.INVALID_PRODUCT_ID})
        }

        const cart=await Cart.findOne({userId});

        if(!cart){
            return res.status(404).json({success:false,message:messages.CART_NOT_FOUND});
        }

        const initialLength =cart.items.length;

        cart.items=cart.items.filter((item)=>item.productId.toString()!==productId);

        if(cart.items.length===initialLength){
            return res.status(404).json({success:false,message:messages.PRODUCT_NOT_FOUND_IN_CART});
        }

        await cart.save();
        await cart.populate("items.productId");

        return res.status(200).json({success:true,message:messages.PRODUCT_REMOVED_FROM_CART,cart});
    }
    catch(error){
        console.log("Remove From Cart Error:",error);
        next(error);
    }
}