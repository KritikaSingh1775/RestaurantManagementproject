import Router from 'express'
import { verifyAdmin, verifyJWT } from '../middleware/auth.middelware.js';
import { addNewMenu,  deleteItem,  fetchFullMenuMenu,  updateItem } from '../controller/menu.controller.js';


const router = Router()

router(verifyJWT)

router.route("/create/new-item").post( addNewMenu)

router.route("/fetch-full/menu").get(fetchFullMenuMenu)

// admin
router.route("/update-item/:itemId").post(verifyAdmin,updateItem)

router.route("/delete-item/:itemId").delete(verifyAdmin, deleteItem)

export default router
