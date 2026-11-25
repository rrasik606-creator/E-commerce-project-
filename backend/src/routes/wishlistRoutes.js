import express from "express";

import { getWishlist,addToWishlist,removeFromWishlist } from "../controllers/wishlistController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import validateMiddleware from "../middlewares/validateMiddleware.js";

import { addToWishlistValidator,removeFromWishlistValidator } from "../validators/wishlistValidator.js";


const router = express.Router();
router.use(authMiddleware);

router.get("/",getWishlist);
router.post("/",addToWishlistValidator,validateMiddleware,addToWishlist);
router.delete("/:productId",removeFromWishlistValidator,validateMiddleware,removeFromWishlist);

export default router