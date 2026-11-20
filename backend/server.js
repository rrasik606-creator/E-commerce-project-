import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet"
import cookieParser from "cookie-parser";

import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import productRoutes from "./src/routes/productRoutes.js"
import errorMiddleware from "./src/middlewares/errorMiddleware.js";


dotenv.config()

const app=express();

app.use(helmet())

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}));

app.use(express.json())
app.use(cookieParser())

app.get("/",(req,res)=>{
    res.status(200).json({message:"VELORA API is running"});
});

app.use("/auth",authRoutes)
app.use("/products",productRoutes)

app.use(errorMiddleware);

const PORT = process.env.PORT||5000;

const startServer = async()=>{
    await connectDB();

    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();