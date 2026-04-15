import Router from 'express'
import { createOrder, deleteTableOrder, orderStatusUpdate, tableOrderUpdate } from '../controller/order.controller.js'
import { verifyAdmin, verifyJWT } from '../middleware/auth.middelware.js'


const router = Router()

router.route('/add/new-order').post(verifyJWT, createOrder)

router.route("/update/table-order/:orderId").post(verifyJWT, tableOrderUpdate)

// admin
router.route("/update/status-order/:orderId").post(verifyAdmin, orderStatusUpdate)

router.route("/delete/table-order/:orderId").delete(verifyJWT, deleteTableOrder)


export default router
