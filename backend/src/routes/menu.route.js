import Router from 'express'
import { verifyAdmin, verifyJWT } from '../middleware/auth.middelware.js';
import { addNewMenu,  deleteItem,  fetchFullMenuMenu,  updateItem } from '../controller/menu.controller.js';
import { uploadImage } from '../middleware/multer.middleware.js';

const router = Router()

router.use(verifyJWT)

router.route("/create/new-item").post( uploadImage.fields(
  [
    {
      name : "itemImage",
      maxCount: 1
    }
  ]
) ,verifyAdmin ,addNewMenu)

router.route("/fetch-full/menu").get(fetchFullMenuMenu)

// admin
router.route("/update-item/:itemId").post(uploadImage.fields(
  [
    {
      name : "itemImage",
      maxCount: 1
    }
  ]
),verifyAdmin,updateItem)

router.route("/delete-item/:itemId").delete(verifyAdmin, deleteItem)

export default router
