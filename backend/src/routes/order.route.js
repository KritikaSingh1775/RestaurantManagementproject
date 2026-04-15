import Router from 'express'
import { allOrders, createOrder, deleteTableOrder, orderStatusUpdate, tableOrderUpdate, userOrder } from '../controller/order.controller.js'
import { verifyAdmin, verifyJWT } from '../middleware/auth.middelware.js'


const router = Router()

router.use(verifyJWT)

router.route('/add/new-order').post(createOrder)

router.route("/update/table-order/:orderId").post(tableOrderUpdate)

// admin
router.route("/update/status-order/:orderId").post(verifyAdmin, orderStatusUpdate)

router.route("/delete/table-order/:orderId").delete(deleteTableOrder)

router.route("/all-orders").get(verifyAdmin, allOrders)

// user orders
router.route("/order-user").get(userOrder)



export default router
