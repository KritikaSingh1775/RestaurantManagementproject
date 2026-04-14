import { body, param } from "express-validator";

const ORDER_STATUS = [
  "pending",
  "confirmed",
  "preparing",
  "delivered",
  "cancelled",
];
const PAYMENT_METHOD = ["COD", "ONLINE"];

// CREATE ORDER
export const createOrderValidator = () => [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Items must be a non-empty array"),

  body("items.*.menuItemId").isMongoId().withMessage("Invalid menuItemId"),

  body("items.*.quantity")
    .isInt({ gt: 0 })
    .withMessage("Quantity must be greater than 0"),

  body("totalAmount")
    .isFloat({ gt: 0 })
    .withMessage("Total amount must be greater than 0"),

  body("paymentMethod")
    .isIn(PAYMENT_METHOD)
    .withMessage("Invalid payment method"),
];

// UPDATE ORDER STATUS
export const updateOrderStatusValidator = () => [
  param("id").isMongoId().withMessage("Invalid order ID"),

  body("status").isIn(ORDER_STATUS).withMessage("Invalid order status"),
];

// GET ORDER
export const getOrderValidator = () => [
  param("id").isMongoId().withMessage("Invalid order ID"),
];
