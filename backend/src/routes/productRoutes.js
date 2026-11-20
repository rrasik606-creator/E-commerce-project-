import express from"express";
import { getAllProduct,getSingleProduct } from "../controllers/productController.js";

const router=express.Router();

router.get("/",getAllProduct)
router.get("/:id",getSingleProduct)

export default router