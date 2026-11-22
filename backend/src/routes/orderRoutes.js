
import express from "express";

import {
  createOrder,
  getMyOrders,
  getSingleOrder,
  cancelOrder
} from "../controllers/orderController.js";

import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createOrder);

router.get("/", getMyOrders);

router.get("/:orderId", getSingleOrder);

router.patch("/:orderId/cancel", cancelOrder);

export default router;
