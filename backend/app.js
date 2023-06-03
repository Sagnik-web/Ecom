const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const errorMid = require('./middleware/error')
const productRouter = require('./Router/productRouter')
const userRoute = require('./Router/userRoute')
const orderRouter = require('./Router/orderRouter')
const app = express()


app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use('/api/v1/product',productRouter)
app.use('/api/v1/user',userRoute)
app.use('/api/v1/order',orderRouter)

app.use(errorMid)


module.exports = app