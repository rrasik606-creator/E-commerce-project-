
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

  // Rate Limit Middleware
  TOO_MANY_LOGIN_ATTEMPTS: "Too many login attempts. Please try again after 15 minutes.",
  TOO_MANY_REGISTRATION_ATTEMPTS: "Too many registration attempts. Please try again later.",

  // Authentication Validation
  NAME_REQUIRED: "Name is required",
  USERNAME_REQUIRED: "Username is required",
  EMAIL_REQUIRED: "Email is required",
  INVALID_EMAIL: "Please provide a valid email",
  PASSWORD_REQUIRED: "Password is required",
  PASSWORD_MIN_LENGTH: "Password must be at least 8 characters long",

  // Product Validation
  PRODUCT_NAME_REQUIRED: "Product name is required",
  PRODUCT_BRAND_REQUIRED: "Brand is required",
  PRODUCT_CATEGORY_INVALID: "Category must be men or women",
  PRODUCT_TYPE_REQUIRED: "Product type is required",
  PRODUCT_PRICE_INVALID: "Price must be a valid non-negative number",
  PRODUCT_ORIGINAL_PRICE_INVALID: "Original price must be a valid non-negative number",
  PRODUCT_DISCOUNT_INVALID: "Discount must be between 0 and 100",
  PRODUCT_RATING_INVALID: "Rating must be between 0 and 5",
  PRODUCT_REVIEWS_INVALID: "Reviews must be a non-negative number",
  PRODUCT_IMAGE_REQUIRED: "At least one product image is required",
  PRODUCT_DESCRIPTION_REQUIRED: "Product description is required",
  PRODUCT_FEATURES_INVALID: "Features must be an array of strings",
  PRODUCT_STOCK_INVALID: "Stock must be a non-negative number",
  PRODUCT_FEATURED_INVALID: "Featured must be a boolean",
  PRODUCT_IS_NEW_INVALID: "isNew must be a boolean",

  // Product Query Validation
  INVALID_PRODUCT_TYPE: "Invalid product type",
  INVALID_BRAND: "Brand must be a string",
  INVALID_SEARCH: "Search must be a string",

  // Order Validation
  ADDRESS_NAME_REQUIRED: "Delivery name is required",
  ADDRESS_PHONE_REQUIRED: "Phone number is required",
  ADDRESS_REQUIRED: "Address is required",
  ADDRESS_CITY_REQUIRED: "City is required",
  ADDRESS_STATE_REQUIRED: "State is required",
  ADDRESS_PINCODE_REQUIRED: "Pincode is required",

  // Admin Controller
  PRODUCT_CREATED: "Product created successfully",
  PRODUCT_UPDATED: "Product updated successfully",
  PRODUCT_DELETED: "Product deleted successfully",
  PRODUCT_RESTORED: "Product restored successfully",
  PRODUCT_PERMANENTLY_DELETED: "Product permanently deleted",
  INVALID_ORDER_STATUS: "Invalid order status",
  ORDER_STATUS_CANNOT_BE_UPDATED: "This order status cannot be updated",
  ORDER_STATUS_UPDATED: "Order status updated successfully",
  USER_NOT_FOUND: "User not found",
  CANNOT_BLOCK_ADMIN: "Admin accounts cannot be blocked",
  CANNOT_BLOCK_SELF: "You cannot block your own account",
  USER_ALREADY_BLOCKED: "User is already blocked",
  USER_ALREADY_UNBLOCKED: "User is already unblocked",
  USER_BLOCKED: "User blocked successfully",
  USER_UNBLOCKED: "User unblocked successfully",
  INVALID_USER_STATUS:"Invalid user status",

  //User Validator
  INVALID_USER_ID: "Invalid user ID",
  };

export default messages;
