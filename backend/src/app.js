import express, { urlencoded } from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import ApiResponse from './utils/ApiResponse.js'
import { corsOrigin } from './utils/config.js'

dotenv.config({
  path : "./.env"
})

const app = express()


app.use(cors({
  origin : corsOrigin,
  credentials : true
}))

app.use(express.json({limit : "2mb"}))
app.use(urlencoded({extended : true}))
app.use(express.static("public"))
app.use(cookieParser())



// ---------------------------------------------------------------------
//  routes import
import AuthRouter from './routes/user.route.js'
import MenuRouter from './routes/menu.route.js'
import OrderRouter from './routes/order.route.js'
import PaymentRouter from './routes/payment.route.js'
import ReservationRouter from './routes/reservation.route.js'


// ---------------------------------------------------------------------
// routes
app.use("/restaurant/api/v1/auth" , AuthRouter)
app.use("/restaurant/api/v1/menu" , MenuRouter)
app.use("/restaurant/api/v1/order" , OrderRouter)
app.use("/restaurant/api/v1/payment" , PaymentRouter)
app.use("/restaurant/api/v1/reserve" , ReservationRouter)


// ---------------------------------------------------------------------
// not found route
app.use("*", (req,res)=>{
  res.status(404).json(new ApiResponse(404, {}, "route not found"))
})



export default app;
