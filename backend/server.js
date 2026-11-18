import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./src/config/db";


dotenv.config()

const app=express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

app.use(express.json())
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.status(200).json({message:"VELORA API is running"});
});

const PORT = process.env.PORT||5000;

const startServer = async()=>{
    await connectDB();

    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();