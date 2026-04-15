import { body, param } from "express-validator";

// CREATE MENU ITEM
export const createMenuItemValidator = () => [
  body("itemsName")
    .trim()
    .notEmpty()
    .withMessage("Items name is required")
    .isLength({ min: 2 })
    .withMessage("Items name must be at least 2 characters"),

  body("itemDescription")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description max 500 chars"),

  body("priceOfItem")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0"),

  body("itemCategory").trim().notEmpty().withMessage("Category is required"),

  body("isAvailable")
    .optional()
    .isBoolean()
    .withMessage("isAvailable must be boolean"),
];

// UPDATE MENU ITEM
export const updateMenuItemValidator = () => [
  param("id").isMongoId().withMessage("Invalid menu item ID"),

  body("name")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  body("price")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0"),

  body("category").optional().trim(),

  body("isAvailable").optional().isBoolean(),
];

// DELETE MENU ITEM
export const deleteMenuItemValidator = () => [
  param("id").isMongoId().withMessage("Invalid menu item ID"),
];
