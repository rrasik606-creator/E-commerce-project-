import express from "express";

import { getCart,addTocart,updateCartQuantity,removeFromCart } from "../controllers/cartController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import validateMiddleware from "../middlewares/validateMiddleware.js";

import { addToCartValidator,updateCartQuantityValidator,removeFromCartValidator } from "../validators/cartValidator.js";
const router=express.Router();

router.use(authMiddleware);

router.get("/",getCart);
router.post("/",addToCartValidator,validateMiddleware,addTocart);
router.patch("/:productId",updateCartQuantityValidator,validateMiddleware,updateCartQuantity);
router.delete("/:productId",removeFromCartValidator,validateMiddleware,removeFromCart);

export default router;