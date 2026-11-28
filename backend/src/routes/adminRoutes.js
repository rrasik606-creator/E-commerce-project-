import express from "express";

import { getAllProducts, getSingleProduct, getDeletedProducts, createProduct,updateProduct,temporaryDeleteProduct, restoreProduct, permanentDeleteProduct, getAllOrders, updateOrderStatus, getAllUsers, blockUser, unblockUser, getDashboardStats } from "../controllers/adminController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
import validateMiddleware from "../middlewares/validateMiddleware.js";

import { createProductValidator,updateProductValidator,getSingleProductValidator } from "../validators/productValidator.js";
import { updateOrderStatusValidator } from "../validators/orderValidator.js";
import { getSingleUserValidator } from "../validators/userValidator.js";


const router = express.Router();

router.use(authMiddleware);
router.use(roleMiddleware("admin"));

router.get("/products",getAllProducts);
router.get("/products/deleted", getDeletedProducts);
router.get("/products/:id",getSingleProductValidator,validateMiddleware,getSingleProduct)
router.post("/products",createProductValidator,validateMiddleware,createProduct);
router.patch("/products/:id",updateProductValidator,validateMiddleware,updateProduct);
router.delete("/products/:id",getSingleProductValidator,validateMiddleware,temporaryDeleteProduct);
router.delete("/products/:id/permanent",getSingleProductValidator,validateMiddleware,permanentDeleteProduct);
router.patch("/products/:id/restore",getSingleProductValidator,validateMiddleware,restoreProduct);

router.get("/orders",getAllOrders);
router.patch("/orders/:id/status",updateOrderStatusValidator,validateMiddleware,updateOrderStatus);

router.get("/users",getAllUsers);
router.patch("/users/:id/block",getSingleUserValidator,validateMiddleware,blockUser);
router.patch("/users/:id/unblock",getSingleUserValidator,validateMiddleware,unblockUser);

router.get("/dashboard",getDashboardStats);

export default router;