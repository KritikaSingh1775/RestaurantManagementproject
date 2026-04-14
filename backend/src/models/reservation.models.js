import mongoose from 'mongoose'
import { tableReservationStatus, tableReservationStatusEnums } from '../utils/constants';

const resevationSchema = new mongoose.Schema(
  {
    name : {
      type : String,
      require : true,
      trim : true
    },
    phoneNumber : {
      type : Number,
      required : true
    },
    noOfGuests : {
      type : Number ,
      required : true
    },
    startTime : {
      type : Date,
      required : true
    },
    tableNo : {
      type : Number,
      required : true
    },
    endTime : {
      type : Date,
      required : true
    },
    SpecialRequests : {
      type : String,
      default : ""
    },
    tableReservationStatus : {
      type : String,
      enum : tableReservationStatusEnums,
      default : tableReservationStatus.PENDING
    }
   }, { timestamps : true }
)


const Reservation = mongoose.model("Reservation", resevationSchema)
export default Reservation;
