import mongoose from 'mongoose'
import {
  orderTypeEnums,
   orderType,
   OrderStatusEnums
  } from '../utils/constants.js'

const orderSchema = new mongoose.Schema(
  {
      items : [
              {
                  itemId : {
                    type : mongoose.Schema.Types.ObjectId,
                    ref : "Menu"
                  },
                  quantity : {
                    type : Number,
                    default : 1
                  }
              }
      ],
      orderType : {
        type : String,
        default : orderType.HOMEDELIVERY ,
        enum : orderTypeEnums
      },
      userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
      },
      address : {
        type : String,
        default : undefined
      },
      tableNo : {
        type : Number,
        default : undefined
      },
      orderStatus : {
        type : String,
        default : OrderStatusEnums.PENDING,
        enum : OrderStatusEnums
      },
      activeOrder : {
        type : Boolean
      },
      specialNotes : {
        type : String,
        default : undefined
      },
      paymentId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Payment",
        default : undefined
      }
  }, { timestamps : true }
)

orderSchema.index({ userId: 1 });

orderSchema.index({ activeOrder: 1 });

orderSchema.index({ orderStatus: 1 });

orderSchema.index({ createdAt: -1 });

orderSchema.index({ userId: 1, createdAt: -1 });

orderSchema.index({ tableNo: 1 });

orderSchema.index({ paymentId: 1 });

const Order = mongoose.model("Order", orderSchema)
export default Order;
