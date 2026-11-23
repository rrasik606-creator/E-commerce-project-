
import mongoose from "mongoose";

import Order from "../models/Order.js";
import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const createOrder = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const userId = req.user.userId;
    const { address, paymentMethod } = req.body;

    // Validate payment method
    if (!["COD", "UPI","Card"].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method"
      });
    }

    // Validate address
    const requiredFields = [
      "name",
      "phone",
      "address",
      "city",
      "state",
      "pincode"
    ];

    const isAddressInvalid = requiredFields.some(
    (field) =>
        typeof address?.[field] !== "string" ||
        !address[field].trim()
    );

    if (isAddressInvalid) {
      return res.status(400).json({
        success: false,
        message: "Please provide complete delivery address"
      });
    }

    let createdOrder;

    await session.withTransaction(async () => {

      // Get user's cart
      const cart = await Cart.findOne({ userId })
        .populate("items.productId")
        .session(session);

      if (!cart || cart.items.length === 0) {
        const error = new Error("Your cart is empty");
        error.statusCode = 400;
        throw error;
      }

      let subtotal = 0;
      const orderItems = [];

      // Validate products and stock
      for (const item of cart.items) {
        const product = item.productId;

        if (!product || product.deleted) {
          const error = new Error("A product in your cart is unavailable");
          error.statusCode = 400;
          throw error;
        }

        if (product.stock < item.quantity) {
          const error = new Error(
            `Only ${product.stock} units of ${product.name} are available`
          );
          error.statusCode = 400;
          throw error;
        }

        // Reduce stock atomically
        const stockUpdate = await Product.updateOne(
          {
            _id: product._id,
            stock: { $gte: item.quantity },
            deleted: { $ne: true }
          },
          {
            $inc: { stock: -item.quantity }
          },
          { session }
        );

        if (stockUpdate.modifiedCount !== 1) {
          const error = new Error(
            `Insufficient stock for ${product.name}`
          );
          error.statusCode = 400;
          throw error;
        }

        // Calculate subtotal using database price
        subtotal += product.price * item.quantity;

        // Save product snapshot
        orderItems.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          image: product.image || [],
          quantity: item.quantity
        });
      }

      // Shipping charge (currently free)
      const shippingCharge = 0;
      const total = subtotal + shippingCharge;

      // Create order
      const [order] = await Order.create(
        [
          {
            userId,
            items: orderItems,
            address,
            paymentMethod,
            subtotal,
            shippingCharge,
            total
          }
        ],
        { session }
      );

      // Clear cart after successful order creation
      cart.items = [];
      await cart.save({ session });

      createdOrder = order;
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: createdOrder
    });

  } catch (error) {
    console.log("Create Order Error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to place order"
    });

  } finally {
    await session.endSession();
  }
};



export const getMyOrders = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    console.log("Get My Orders Error:", error);
    next(error);
  }
};


export const getSingleOrder = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { orderId } = req.params;

    if (!mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID"
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      userId
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    return res.status(200).json({
      success: true,
      order
    });

  } catch (error) {
    console.log("Get Single Order Error:", error);
    next(error);
  }
};


export const cancelOrder = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const userId = req.user.userId;
    const { orderId } = req.params;

    if (!mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID"
      });
    }

    let cancelledOrder;

    await session.withTransaction(async () => {
      const order = await Order.findOne({
        _id: orderId,
        userId
      }).session(session);

      if (!order) {
        const error = new Error("Order not found");
        error.statusCode = 404;
        throw error;
      }

      if (order.status !== "Pending") {
        const error = new Error(
          "Only pending orders can be cancelled"
        );
        error.statusCode = 400;
        throw error;
      }

      // Restore product stock
      for (const item of order.items) {
        await Product.updateOne(
          { _id: item.productId },
          { $inc: { stock: item.quantity } },
          { session }
        );
      }

      order.status = "Cancelled";

      await order.save({ session });

      cancelledOrder = order;
    });

    return res.status(200).json({
      success: true,
      message: "Order cancelled successfully",
      order: cancelledOrder
    });

  } catch (error) {
    console.log("Cancel Order Error:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to cancel order"
    });

  } finally {
    await session.endSession();
  }
};
