import asyncHandler from '../utils/asyncHandler';
import ApiResponse from '../utils/ApiResponse';
import { requiredField } from '../utils/helper';
import Reservation from '../models/reservation.models';
import ApiError from '../utils/ApiError';
import { tableReservationStatus } from '../utils/constants';


const tableReservation = asyncHandler(async(req,res) => {


  const { tableNo, startTime, endTIme, date, noOfGuest, name, SpecialRequests } = req.body


    requiredField([tableNo, startTime, endTIme, date, noOfGuest])

    if(SpecialRequests === undefined) {
      SpecialRequests = ""
    }


    const tableResereve = {
      name : name ? name :  req.user?.fullName,
      phoneNumber : phoneNumber ?  phoneNumber :   req.user?.phoneNumber,
      tableNo : tableNo,
      startTime : new Date(startTime),
      endTIme : new Date(endTIme),
      date : new Date(date),
      noOfGuest : noOfGuest,
      SpecialRequests : SpecialRequests
    }

  return res.status(200).json(new ApiResponse(200, {}, "Your table was reserve will email it on confirmation"))
})

const tableReservationUpdate = asyncHandler(async(req,res) => {

    const { tableNo, status } = req.body
    const { tableReservationId } = req.params

    requiredField([ status])

    const tableReservation = await Reservation.findById(tableReservationId)

    if(!tableReservation) {
       throw new ApiError(400, "Reservation will be not exists")
    }


    const updateData = {
        tableReservationStatus : status,
        tableNo : tableNo
    }



   const reservation = await Reservation.findByIdAndUpdate(tableReservation?._id, {
        $set : {
          updateData
        }
    }, { save : true })

      if(!reservation) {
        throw new ApiError(400, "Can't reservation update")
      }

      if(reservation.tableReservationStatus === tableReservationStatus.CONFIRM) {
        /*
       todo : email sent on user email table confirmation
        emailId : req.user?.email
        subject : req.user.fullName
        reservation.table no. table will be book on date and it's start time and end time with noOf guest
      */
        console.log("Email for confirm your slot of no of guest on table")
      }



  return res.status(200).json(new ApiResponse(200, {}, "Table reservation will update"))
})


export {
  tableReservation,
  tableReservationUpdate
}
