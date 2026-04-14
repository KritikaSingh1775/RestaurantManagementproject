import Order from "../models/order.models.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { OrderStatusEnums, orderType } from "../utils/constants.js";
import { requiredField } from '../utils/helper.js';


const createOrder = asyncHandler(async (req, res) => {
  const { typeOfOrder, tableNo, specialNotes, items, address } = req.body;

  if (!Object.values(orderType).includes(typeOfOrder)) {
    throw new ApiError(400, "Invalid order type");
  }

  requiredField([items]);
  if (!Array.isArray(items) || items.length === 0) {
    throw new ApiError(400, "Items must be a non-empty array");
  }

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

const orderStatusUpdate = asyncHandler(async(req,res)=>{

    const { status } = req.body
    const { orderId } = req.params

    requiredField([status])

    if(!OrderStatusEnums.includes(status)) {
      throw new Error(400, "Please put some validate status")
    }

    const tableOrder = await Order.findById(orderId)

    if(!tableOrder) {
      throw new ApiError(400, "Order not found")
    }


    const order = await Order.findByIdAndUpdate(orderId, {
      $set : {
        orderStatus : status
      }
    }, { save : false })

    if(!order) {
      throw new ApiError(400, " order status can't change ")
    }

    return res.status(200).json(new ApiResponse(200, {} , "Order updated successfully"))
})

const tableOrderUpdate = asyncHandler(async(req,res) => {

    const { orderId } = req.params

    const { items, specialNotes, tableNo } = req.body

    const order = await Order.findById(orderId)

    if(!order) {
      throw new ApiError(400, "Order can't find")
    }

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
    orderId,
    { $set: updateData },
    { new: true }
  );


    return res.status(200).json(new ApiResponse(200, { updatedOrder } , "table order update"))
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
})



export {
  createOrder,
  orderStatusUpdate,
  tableOrderUpdate,
  deleteTableOrder
};
