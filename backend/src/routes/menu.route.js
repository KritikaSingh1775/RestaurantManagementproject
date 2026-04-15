import Router from "express";
import { verifyJWT } from "../middleware/auth.middelware.js";
import { addNewMenu } from "../controller/menu.controller.js";
import { uploadMenu } from "../middleware/multer.middleware.js";
import { createMenuItemValidator, validate } from "../validators/index.js";

const router = Router();

router
  .route("/create/new-item")
  .post(
    verifyJWT,
    uploadMenu.single("image"),
    createMenuItemValidator(),
    validate,
    addNewMenu,
  );

export default router;
