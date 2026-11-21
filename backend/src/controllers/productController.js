import mongoose from "mongoose";
import Product from "../models/Product.js";

export const getAllProduct =async(req,res,next)=>{
    try{
        const {type,brand,search}=req.query;

        const filter={
            deleted:{$ne:true}
        };

        if(type){
            filter.type=type;
        }
        if(brand){
            filter.brand=brand
        }

        if(search){
            filter.$or=[
                {
                    name:{
                        $regex:search,
                        $options:"i"
                    }
                },
                {
                    brand:{
                        $regex:search,
                        $options:"i"
                    }
                }
            ];
        }

        const products=await Product.find(filter);

        return res.status(200).json({success:true,count:products.length,products})
    }
    catch(error){
        console.error("GET ALL PRODUCTS ERROR:", error);
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
        console.log("GET SINGLEPRODUCT ERROR:",error)
        next(error);
    }
}