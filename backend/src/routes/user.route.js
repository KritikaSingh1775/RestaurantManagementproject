import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  verifyEmail,
  updateAvatar,
} from "../controller/user.controller.js";
import { uploadAvatar } from "../middleware/multer.middleware.js";
import { verifyJWT } from "../middleware/auth.middelware.js";
import passport from "../passport/index.js";

const router = Router();

import {
  userRegisterValidator,
  userLoginValidator,
  validate,
} from "../validators/index.js";

router
  .route("/user/register")
  .post(userRegisterValidator(), validate, registerUser);

router.route("/user/login").post(userLoginValidator(), validate, loginUser);

router.route("/user/logout").post(verifyJWT, logoutUser);

router.route("/user/email-verify").post(verifyJWT, verifyEmail);

router
  .route("/auth/avatar")
  .post(verifyJWT, uploadAvatar.single("avatar"), updateAvatar);

router.route("/google").get(
  passport.authenticate("google", {
    scope: ["profile", "email"],
  }),
);

export default router;
