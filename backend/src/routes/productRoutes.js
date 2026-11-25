import express from"express";
import { getAllProduct,getSingleProduct } from "../controllers/productController.js";

import validateMiddleware from "../middlewares/validateMiddleware.js";

import { getAllProductValidator,getSingleProductValidator } from "../validators/productValidator.js";

const router=express.Router();

router.get("/",getAllProductValidator,validateMiddleware,getAllProduct)
router.get("/:id",getSingleProductValidator,validateMiddleware,getSingleProduct)

export default router