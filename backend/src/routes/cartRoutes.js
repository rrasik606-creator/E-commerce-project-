import express from "express";

import { getCart,addTocart,updateCartQuantity,removeFromCart } from "../controllers/cartController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
const router=express.Router();

router.use(authMiddleware);

router.get("/",getCart);
router.post("/",addTocart);
router.patch("/:productId",updateCartQuantity);
router.delete("/:productId",removeFromCart);

export default router;