import { body, param, query } from "express-validator";

// Mongo ID validator
export const mongoIdValidator = (field = "id") => {
  return param(field)
    .isMongoId()
    .withMessage(`${field} must be a valid Mongo ID`);
};
// Required string
export const requiredString = (field) => {
  return body(field)
    .trim()
    .notEmpty()
    .withMessage(`${field} is required`)
    .isString()
    .withMessage(`${field} must be a string`);
};

// Positive number
export const positiveNumber = (field) => {
  return body(field)
    .notEmpty()
    .withMessage(`${field} is required`)
    .isFloat({ gt: 0 })
    .withMessage(`${field} must be greater than 0`);
};
