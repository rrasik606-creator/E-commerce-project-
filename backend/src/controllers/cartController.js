import mongoose from "mongoose";

import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

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
            return res.status(400).json({success:false,message:"Invalid product ID"});
        }
        if(!Number.isInteger(quantity)||quantity<1){
            return res.status(400).json({success:false,message:"Quantity must be a positive integer"});
        }

        const product=await Product.findOne({_id:productId,deleted:{$ne:true}});

        if(!product){
            return res.status(404).json({success:false,message:"Product not found"});
        }

        if(product.stock<1){
            return res.status(400).json({success:false,message:"Product is out of stock"});
        }

        let cart=await Cart.findOne({userId});

        if(!cart){
            cart=new Cart({userId,items:[]});
        }

        const existingItem= cart.items.find((item)=>item.productId.toString()===productId);

        if(existingItem){
            const newQuantity =existingItem.quantity+quantity

            if(newQuantity>product.stock){
                return res.status(400).json({success:false,message:`Only ${product.stock} items are available`})
            }

            existingItem.quantity=newQuantity;
        }
        else{
            if(quantity>product.stock){
                return res.status(400).json({success:false,message:`Only ${product.stock} items are available`});
            }

            cart.items.push({productId,quantity});
        }    

        await cart.save();

        await cart.populate("items.productId");

        return res.status(200).json({success:true,message:"Product added to cart",cart});
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
            return res.status(400).json({success:false,message:"Invalid product ID"});
        }
        if(!Number.isInteger(quantity)||quantity<1){
            return res.status(400).json({success:false,message:"Quantity must be a positive integer"});
        }

        const cart=await Cart.findOne({userId});

        if(!cart){
            return res.status(404).json({success:false,message:"Cart not found"});
        }

        const cartItem=cart.items.find((item)=>item.productId.toString()===productId);

        if(!cartItem){
            return res.status(404).json({success:false,message:"Product not found in cart"});
        }

        const product=await Product.findOne({_id:productId,deleted:{$ne:true}});

        if(!product){
            return res.status(404).json({success:false,message:"Product not found"});
        }

        if(quantity>product.stock){
            return res.status(400).json({success:false,message:`Only ${product.stock} items are available`})
        }

        cartItem.quantity=quantity;

        await cart.save();
        await cart.populate("items.productId");

        return res.status(200).json({success:true,message:"Cart quantity updated",cart});
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
            return res.status(400).json({success:false,message:"Invalid product ID"})
        }

        const cart=await Cart.findOne({userId});

        if(!cart){
            return res.status(404).json({success:false,message:"Cart not found"});
        }

        const initialLength =cart.items.length;

        cart.items=cart.items.filter((item)=>item.productId.toString()!==productId);

        if(cart.items.length===initialLength){
            return res.status(404).json({success:false,message:"Product not found in cart"});
        }

        await cart.save();
        await cart.populate("items.productId");

        return res.status(200).json({success:true,message:"Product removed from cart",cart});
    }
    catch(error){
        console.log("Remove From Cart Error:",error);
        next(error);
    }
}