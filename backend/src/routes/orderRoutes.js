import express from "express";

import {createOrder,getMyOrders,cancelOrder} from "../controllers/orderController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import validateMiddleware from "../middlewares/validateMiddleware.js";

import { createOrderValidator,cancelOrderValidator } from "../validators/orderValidator.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createOrderValidator, validateMiddleware, createOrder);

router.get("/", getMyOrders);

// router.get("/:orderId", getSingleOrderValidator, validateMiddleware, getSingleOrder);

router.patch("/:orderId/cancel", cancelOrderValidator, validateMiddleware, cancelOrder);

export default router;
