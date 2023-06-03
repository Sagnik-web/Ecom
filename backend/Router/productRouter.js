const express = require('express')
const { getAllProduct, createProduct, getOneProduct, updateProduct, deleteProduct, sendReviews, getProductReviews, removeReviews } = require('../Controller/productController')
const { protect } = require('../Controller/userController')
const productRouter = express.Router()

productRouter.route('/').get(getAllProduct).post(protect,createProduct)
productRouter.route('/:ID').get(getOneProduct).put(protect,updateProduct).delete(protect,deleteProduct)
productRouter.route('/review').post(protect,sendReviews)
productRouter.route('/review/:ID').get(getProductReviews)
productRouter.route('/review/:productID/:ID').delete(protect,removeReviews)

module.exports = productRouter