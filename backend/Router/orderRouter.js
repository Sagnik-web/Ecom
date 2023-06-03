const express = require('express')
const { createOrder, userOrder, allOrders, deleteUserOrder, deleteOrder, updateOrder } = require('../Controller/orderController')
const { protect, roleAuth } = require('../Controller/userController')
const orderRouter = express.Router()


orderRouter.route('/').post(protect,createOrder).get(protect,userOrder)
orderRouter.route('/admin').get(protect,roleAuth('admin'),allOrders)
orderRouter.route('/admin/:ID').delete(protect,roleAuth('admin'),deleteOrder).delete(protect,deleteUserOrder).put(protect,updateOrder)

module.exports = orderRouter