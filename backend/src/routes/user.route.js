import { Router } from 'express'
import {
  allUsers,
  currentUser,
  loginUser,
  logoutUser,
  registerUser,
  verifyEmail
} from "../controller/user.controller.js"
import { verifyAdmin, verifyJWT } from "../middleware/auth.middelware.js"
import passport from "../passport/index.js"
import { uploadAvatar } from '../middleware/multer.middleware.js'
import { googleCallbackUrL } from '../utils/config.js'

const router = Router()

router.route("/user/register").post(
  uploadAvatar.fields(
  [
    {
      name : "avatar",
      maxCount: 1
    }
  ]
),
  registerUser
);

router.route("/user/login").post(loginUser)

router.route("/user/logout").post(verifyJWT, logoutUser)

router.route("/user/email-verify").post(verifyJWT, verifyEmail)

router.route("/user/all-users").get(verifyAdmin, allUsers)

router.route("/user/me").get(verifyJWT, currentUser)

router.route("/callback/google").get(  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login' 
  }))


export default router;
