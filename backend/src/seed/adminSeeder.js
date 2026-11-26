import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import mongoose from "mongoose";
import User from "../models/User.js";

const createAdmin = async () => {
    try {
        await connectDB();

        const existingAdmin = await User.findOne({
            email: "admin@velora.com"
        });

        if (existingAdmin) {
            console.log("Admin already exists");
            return;
        }

        const admin = await User.create({
            name: "VELORA Admin",
            username: "velora_admin",
            email: "admin@velora.com",
            password: "Admin@12345",
            role: "admin"
        });

        console.log("Admin created successfully:", admin.email);

    } catch (error) {
        console.error("Error creating admin:", error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
    }
};

createAdmin();