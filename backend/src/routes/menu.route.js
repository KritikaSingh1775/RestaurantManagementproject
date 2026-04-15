import Router from 'express'
import { verifyAdmin, verifyJWT } from '../middleware/auth.middelware.js';
import { addNewMenu,  updateItem } from '../controller/menu.controller.js';


const router = Router()

router.route("/create/new-item").post(verifyJWT, addNewMenu)

// admin
router.route("/change-price/item/:itemId").post(verifyAdmin,updateItem)


export default router
