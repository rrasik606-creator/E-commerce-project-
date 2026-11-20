import mongoose from "mongoose";
import Product from "../models/Product.js";

export const getAllProduct =async(req,res,next)=>{
    try{
        const products=await Product.find({deleted:{$ne:true}});
        return res.status(200).json({success:true,count:products.length,products})
    }
    catch(error){
        next(error)
    }
};

export const getSingleProduct=async(req,res,next)=>{
    try{
        const {id} = req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({success:false,message:"Invalid product ID"});
        }

        const product=await Product.findOne({_id:id,deleted:{$ne:true}});

        if(!product){
            return res.status(404).json({success:false,message:"Product not found"});
        }

        return res.status(200).json({success:true,product})
    }
    catch(error){
        next(error);
    }
}