import dotenv from "dotenv";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "../config/db.js";
import Product from "../models/Product.js";
import mongoose from "mongoose";

dotenv.config();

const _filename=fileURLToPath(import.meta.url);
const _dirname=path.dirname(_filename);

const seedProduct=async()=>{
    try{
        await connectDB();

        const filePath=path.resolve(_dirname,"../../../frontend/db.json");
        const fileData=await fs.readFile(filePath,"utf-8");

        const data=JSON.parse(fileData);

        const products= data.products;

        if(!Array.isArray(products)){
            throw new Error("Products are not found in db.json");
        }

        const existingProduct=await Product.countDocuments();

        if(existingProduct>0){
            throw new Error("Products already exist. Seeding cancelled to prevent duplicates.")
        }

        const formattedProducts=products.map(({id,...product})=>product);

        const insertedProducts=await Product.insertMany(formattedProducts);
        console.log(`${insertedProducts.length} products inserted successfully`);

    }
    catch(error){
        console.log("Product seeding failed:", error.message);
        process.exitCode=1;
    }
    finally{
        await mongoose.disconnect();
    }
}

seedProduct()