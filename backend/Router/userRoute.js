const express = require('express')
const { createUser, login, logout, forgotPassword, resetPassword, allUsers, userAccount, updatePassword, protect, roleAuth } = require('../Controller/userController')
const userRoute = express.Router()

userRoute.route('/register').post(createUser)
userRoute.route('/login').post(login)
userRoute.route('/logout').get(logout)
userRoute.route('/forgotPassword').post(forgotPassword)
userRoute.route('/updatePassword').put(protect,updatePassword)
userRoute.route('/resetPassword').post(resetPassword)
userRoute.route('/allUser').get(protect,roleAuth('admin'),allUsers)
userRoute.route('/me').get(protect,userAccount)


module.exports = userRoute