import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';
import { requiredField } from '../utils/helper.js';
import Reservation from '../models/reservation.models.js';
import ApiError from '../utils/ApiError.js';
import { emailService } from '../services/email.service.js';
import { tableReservationStatus, tableReservationStatusEnums } from '../utils/constants.js';

const newTableReservation = asyncHandler(async (req, res) => {
  let {
    tableNo,
    startTime,
    endTime,
    date,
    noOfGuests,
    name,
    SpecialRequests,
    phoneNumber,
    reservationUserEmail
  } = req.body;

  requiredField([tableNo, startTime, endTime, date, noOfGuests]);

  SpecialRequests = SpecialRequests ?? "";

  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) {
    throw new ApiError(400, "Invalid date format. Use YYYY-MM-DD");
  }

  const startDateTime = new Date(`${date}T${startTime}:00`);
  const endDateTime = new Date(`${date}T${endTime}:00`);

  if (isNaN(startDateTime) || isNaN(endDateTime)) {
    throw new ApiError(400, "Invalid time format. Use HH:mm");
  }

  if (endDateTime <= startDateTime) {
    throw new ApiError(400, "End time must be after start time");
  }

  const tableReservationData = {
    name: name ?? req.user?.fullName,
    phoneNumber: phoneNumber ?? req.user?.phoneNumber,
    tableNo,
    startTime: startDateTime,
    endTime: endDateTime,
    date: parsedDate,
    noOfGuests : noOfGuests,
    SpecialRequests,
    reservationUserEmail: reservationUserEmail ?? req.user?.email
  };

  await Reservation.create(tableReservationData);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Your table was reserve will email it on confirmation"));
});

const availableTableForReservation = asyncHandler(async (req, res) => {
  const { noOfGuests, date, startTime, endTime } = req.query;

  if (!noOfGuests || !date || !startTime || !endTime) {
    throw new ApiError(400, "Missing required query params");
  }

  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) {
    throw new ApiError(400, "Invalid date format. Use YYYY-MM-DD");
  }

  const startDateTime = new Date(`${date}T${startTime}:00`);
  const endDateTime = new Date(`${date}T${endTime}:00`);

  if (isNaN(startDateTime) || isNaN(endDateTime)) {
    throw new ApiError(400, "Invalid time format. Use HH:mm");
  }

  if (endDateTime <= startDateTime) {
    throw new ApiError(400, "End time must be after start time");
  }

  const range = tableMapping[noOfGuests];

  if (!range) {
    throw new ApiError(400, "Invalid number of guests");
  }

  const possibleTables = Array.from(
    { length: range.end - range.start + 1 },
    (_, i) => range.start + i
  );

  const reservedTables = await Reservation.find({
    tableNo: { $in: possibleTables },
    date: parsedDate,
    $or: [
      {
        startTime: { $lt: endDateTime },
        endTime: { $gt: startDateTime }
      }
    ]
  }).select("tableNo");

  const reservedTableNos = reservedTables.map(r => r.tableNo);

  const freeTables = possibleTables.filter(
    table => !reservedTableNos.includes(table)
  );

  return res.status(200).json(
    new ApiResponse(200, { freeTables }, "Free tables fetched successfully")
  );
});

const tableReservationStatusAndSendEmailOnConfirmation = asyncHandler(async (req, res) => {
  const { tableNo, tableReservationStatus } = req.body;
  const { tableReservationId } = req.params;

  requiredField([tableReservationStatus]);

  const tableReservation = await Reservation.findById(tableReservationId);

  if (!tableReservation) {
    throw new ApiError(404, "Reservation does not exist");
  }

  const updateData = {
    tableReservationStatus,
    ...(tableNo && { tableNo })
  };

  const reservation = await Reservation.findByIdAndUpdate(
    tableReservation._id,
    { $set: updateData },
    { new: true, runValidators: true }
  );

  if (!reservation) {
    throw new ApiError(400, "Reservation update failed");
  }

  await reservation.populate("reservationUserId", "name email phoneNumber");

  console.log(reservation.tableReservationStatus)

      await emailService(
        reservation.reservationUserEmail,
        reservation.name,
        reservation.tableReservationStatus,
        reservation.tableNo,
        reservation.noOfGuests,
        reservation.date,
        reservation.startTime,
        reservation.endTime,
        reservation._id
      )


  return res.status(200).json(
    new ApiResponse(200, reservation, "Table reservation updated successfully")
  );
});



export {
  newTableReservation,
  tableReservationStatusAndSendEmailOnConfirmation,
  availableTableForReservation
}
