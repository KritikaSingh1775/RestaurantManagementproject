import { body } from "express-validator";
import { AvailableUserRoles } from "../constant.js";

// REGISTER
export const userRegisterValidator = () => [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),

  body("username")
    .trim()
    .notEmpty()
    .withMessage("Username is required")
    .isLowercase()
    .withMessage("Username must be lowercase")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters"),

  body("password")
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  body("role")
    .optional()
    .isIn(AvailableUserRoles)
    .withMessage("Invalid user role"),
];

// LOGIN
export const userLoginValidator = () => [
  body().custom((_, { req }) => {
    if (!req.body.email && !req.body.username) {
      throw new Error("Email or Username is required");
    }
    return true;
  }),

  body("email").optional().isEmail().withMessage("Invalid email"),

  body("username").optional().isString(),

  body("password").notEmpty().withMessage("Password is required"),
];

// CHANGE PASSWORD
export const userChangePasswordValidator = () => [
  body("oldPassword").notEmpty().withMessage("Old password is required"),

  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters"),
];

// FORGOT PASSWORD
export const userForgotPasswordValidator = () => [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email"),
];

// RESET PASSWORD
export const userResetPasswordValidator = () => [
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

// ASSIGN ROLE
export const userAssignRoleValidator = () => [
  body("role").notEmpty().isIn(AvailableUserRoles).withMessage("Invalid role"),
];
