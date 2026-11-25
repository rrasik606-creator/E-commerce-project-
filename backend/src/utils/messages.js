
const messages = {
  // Common
  INTERNAL_SERVER_ERROR: "Internal server error",

  // Authentication - Register
  ALL_FIELDS_REQUIRED: "All fields are required",
  EMAIL_ALREADY_EXISTS: "Email already exists",
  REGISTRATION_SUCCESSFUL: "Registration successful",

  // Authentication - Login
  EMAIL_PASSWORD_REQUIRED: "Email and password are required",
  INVALID_CREDENTIALS: "Invalid email or password",
  ACCOUNT_BLOCKED: "Your account has been blocked",
  LOGIN_SUCCESSFUL: "Login successful",

  // Authentication - Refresh
  REFRESH_TOKEN_REQUIRED: "Refresh token is required",
  INVALID_REFRESH_TOKEN: "Invalid or expired refresh token",
  USER_NOT_FOUND_OR_BLOCKED: "User not found or account blocked",
  REFRESH_TOKEN_EXPIRED_OR_USED: "Refresh token has already been used or expired",
  TOKEN_REFRESHED: "Token refreshed successfully",

  // Authentication - Logout
  LOGOUT_SUCCESSFUL: "Logout successful",

  // Product
  INVALID_PRODUCT_ID: "Invalid product ID",
  PRODUCT_NOT_FOUND: "Product not found",

  // Cart
  INVALID_QUANTITY: "Quantity must be a positive integer",
  PRODUCT_OUT_OF_STOCK: "Product is out of stock",
  STOCK_LIMIT_EXCEEDED: "Only {stock} items are available",
  CART_NOT_FOUND: "Cart not found",
  PRODUCT_NOT_FOUND_IN_CART: "Product not found in cart",
  PRODUCT_ADDED_TO_CART: "Product added to cart",
  CART_QUANTITY_UPDATED: "Cart quantity updated",
  PRODUCT_REMOVED_FROM_CART: "Product removed from cart",

  // Wishlist
  PRODUCT_ALREADY_IN_WISHLIST: "Product already exists in wishlist",
  PRODUCT_ADDED_TO_WISHLIST: "Product added to wishlist",
  WISHLIST_NOT_FOUND: "Wishlist not found",
  PRODUCT_NOT_FOUND_IN_WISHLIST: "Product not found in wishlist",
  PRODUCT_REMOVED_FROM_WISHLIST: "Product removed from wishlist",

  // Order
  INVALID_PAYMENT_METHOD: "Invalid payment method",
  INCOMPLETE_DELIVERY_ADDRESS: "Please provide complete delivery address",
  EMPTY_CART: "Your cart is empty",
  UNAVAILABLE_CART_PRODUCT: "A product in your cart is unavailable",
  ORDER_STOCK_LIMIT: "Only {stock} units of {product} are available",
  INSUFFICIENT_PRODUCT_STOCK: "Insufficient stock for {product}",
  ORDER_PLACED: "Order placed successfully",
  FAILED_TO_PLACE_ORDER: "Failed to place order",
  INVALID_ORDER_ID: "Invalid order ID",
  ORDER_NOT_FOUND: "Order not found",
  PENDING_ORDERS_ONLY: "Only pending orders can be cancelled",
  ORDER_CANCELLED: "Order cancelled successfully",
  FAILED_TO_CANCEL_ORDER: "Failed to cancel order",

  // Authentication Middleware
  ACCESS_TOKEN_REQUIRED: "Access token is required",
  INVALID_ACCESS_TOKEN: "Invalid or expired access token",

  // Role Middleware
  AUTHENTICATION_REQUIRED: "Authentication required",
  PERMISSION_DENIED: "You don't have permission to perform this action",

  // Rate Limit
  TOO_MANY_LOGIN_ATTEMPTS: "Too many login attempts. Please try again after 15 minutes.",
  TOO_MANY_REGISTRATION_ATTEMPTS: "Too many registration attempts. Please try again later.",
};

export default messages;
