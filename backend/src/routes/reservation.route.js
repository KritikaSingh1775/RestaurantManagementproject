import Router from 'express'
import {
  availableTableForReservation,
  newTableReservation,
   tableReservationStatusAndSendEmailOnConfirmation
   } from '../controller/reservation.controller.js'
import { verifyAdmin } from '../middleware/auth.middelware.js'
import { verifyJWT } from '../middleware/auth.middelware.js';

const router = Router()

router.use(verifyJWT)

router.route("/new-reserve").post( newTableReservation)

router.route("/update-reservation/:tableReservationId").post(verifyAdmin, tableReservationStatusAndSendEmailOnConfirmation)


router.route("/available-table").post(availableTableForReservation)

export default router
