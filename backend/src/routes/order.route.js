import Router from "express";
import { createOrder } from "../controller/order.controller.js";
import { verifyJWT } from "../middleware/auth.middelware.js";
import { createOrderValidator, validate } from "../validators/index.js";

const router = Router();

router
  .route("/add/new-order")
  .post(verifyJWT, createOrderValidator(), validate, createOrder);

export default router;
