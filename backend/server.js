import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet"
import cookieParser from "cookie-parser";

import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js";
import productRoutes from "./src/routes/productRoutes.js";
import cartRoutes  from "./src/routes/cartRoutes.js";
import wishlistRoutes  from "./src/routes/wishlistRoutes.js";
import orderRoutes  from "./src/routes/orderRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import errorMiddleware from "./src/middlewares/errorMiddleware.js";

import dns from "node:dns";
dns.setServers(["8.8.8.8","8.8.4.4"])



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

app.use("/auth",authRoutes);
app.use("/products",productRoutes);
app.use("/cart",cartRoutes);
app.use("/wishlist",wishlistRoutes);
app.use("/orders",orderRoutes);


app.use("/admin",adminRoutes);

app.use(errorMiddleware);

const PORT = process.env.PORT||5000;

const startServer = async()=>{
    await connectDB();

    app.listen(PORT,()=>{
        console.log(`Server is running on port ${PORT}`);
    });
};

startServer();