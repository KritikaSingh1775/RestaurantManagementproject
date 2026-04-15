import Order from "../models/order.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { OrderStatusEnums, orderType } from "../utils/constants.js";
import { requiredField } from '../utils/helper.js';
import mongoose  from "mongoose";


const createOrder = asyncHandler(async (req, res) => {
  const { typeOfOrder, tableNo, specialNotes, items, address } = req.body;

      if (!Object.values(orderType).includes(typeOfOrder)) {
        throw new ApiError(400, "Invalid order type");
      }

      requiredField(items);

    if (!Array.isArray(items) || items.length === 0) {
      throw new ApiError(400, "Items must be a non-empty array");
    }

    items.forEach((item) => {
      if (!item.itemId || !item.quantity) {
        throw new ApiError(400, "Each item must have itemId and quantity");
      }

      if (item.quantity <= 0) {
        throw new ApiError(400, "Quantity must be greater than 0");
      }

      if (!mongoose.Types.ObjectId.isValid(item.itemId)) {
        throw new ApiError(400, `Invalid itemId: ${item.itemId}`);
      }
    });

    let orderData = {
      orderType: typeOfOrder,
      userId: req.user._id,
      items,
      activeOrder: false,
    };

  if (typeOfOrder === orderType.TABLEORDER) {
    requiredField([tableNo]);

    orderData.tableNo = tableNo;
    orderData.specialNotes = specialNotes;

  } else if (typeOfOrder === orderType.HOMEDELIVERY) {
    requiredField([address]);
    orderData.address = address;
  }

  const order = await Order.create(orderData);

  return res
    .status(201)
    .json(new ApiResponse(201, { order }, "Order created successfully"));
});

// admin
const orderStatusUpdate = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const { orderId } = req.params;

  requiredField([status]);

  if (!OrderStatusEnums.includes(status)) {
    throw new ApiError(400, "Please provide a valid status");
  }

  const order = await Order.findByIdAndUpdate(
    orderId,
    {
      orderStatus: status,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res.status(200).json(
    new ApiResponse(200, order, "Order updated successfully")
  );
});

const tableOrderUpdate = asyncHandler(async(req,res) => {

    const { orderId } = req.params

    const { items, specialNotes, tableNo } = req.body

    const order = await Order.findById(orderId)

    if(!order) {
      throw new ApiError(400, "Order can't find")
    }
      requiredField(items);

    if (!Array.isArray(items) || items.length === 0) {
      throw new ApiError(400, "Items must be a non-empty array");
    }

    items.forEach((item) => {
      if (!item.itemId || !item.quantity) {
        throw new ApiError(400, "Each item must have itemId and quantity");
      }

      if (item.quantity <= 0) {
        throw new ApiError(400, "Quantity must be greater than 0");
      }

    })

    const updateData = {}

    if(order.userId !== req.user?._id) {
      throw new ApiError(401, "You can't update the Table order")
    }


    if(order.orderType !== orderType.TABLEORDER ) {
      throw new ApiResponse(400, "This is not Table order")
    }

    if (items) {
    if (!Array.isArray(items) || items.length === 0) {
      throw new ApiError(400, "Items must be a non-empty array");
    }
    updateData.items = items;
  }

  if (tableNo) {
    if (tableNo <= 0) {
      throw new ApiError(400, "Invalid table number");
    }
    updateData.tableNo = tableNo;
  }

  if (specialNotes !== undefined) {
    updateData.specialNotes = specialNotes;
  }

  const updatedOrder = await Order.findByIdAndUpdate(
    order?._id,
    { $set: updateData },
    { new: true }
  );


    return res.status(200).json(new ApiResponse(200,  { updatedOrder }  , "table order update"))
})

const deleteTableOrder = asyncHandler(async(req,res)=>{

    const { orderId } = req.params

    const order = await Order.findById(orderId)

     if(order.orderType !== orderType.TABLEORDER ) {
      throw new ApiResponse(400, "This is not Table order")
    }

    if(order.userId !== req.user?._id) {
      throw new ApiError(401, "You can't Delete the Table order")
    }

    await Order.findByIdAndDelete(order?._id)

  return res.status(200).json(new ApiResponse(200, {}, "Table order delete successfully"))
});



export {
  createOrder,
  orderStatusUpdate,
  tableOrderUpdate,
  deleteTableOrder
}
