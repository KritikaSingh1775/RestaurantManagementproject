import Router from 'express'
import {
  newTableReservation,
   tableReservationStatusAndSendEmailOnConfirmation
   } from '../controller/reservation.controller.js'
import { verifyAdmin } from '../middleware/auth.middelware.js'
import { verifyJWT } from '../middleware/auth.middelware';

const router = Router()

router.route("/new-reserve").post(verifyJWT, newTableReservation)

router.route("/update-reservation/:tableReservationId").post(verifyAdmin, tableReservationStatusAndSendEmailOnConfirmation)

export default router
