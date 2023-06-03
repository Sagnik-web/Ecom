const catchAsyncError = require("../middleware/catchAsyncError");
const Order = require("../Model/orderModel");
const Product = require("../Model/productModel");
const ErrorHandeler = require("../utils/ErrorHandeler");

exports.createOrder = catchAsyncError(async(req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo,itemPrices,shippingCharge,tax} = req.body
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrices,
        shippingCharge,
        tax,
        payedAt:Date.now(),
        user:req.user._id
    })
    if(!order){
        return next(new ErrorHandeler('Order is not Plased.',400))
    }

    res.status(200).json({
        success:true,
        order
    })
})


exports.userOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.find({user:req.user._id})
    if(!order){
        return next(new ErrorHandeler('Order is not Plased.',400))
    }

    res.status(200).json({
        success:true,
        order
    })
})


exports.allOrders = catchAsyncError(async(req,res,next)=>{
    const order = await Order.find()

    res.status(200).json({
        success:true,
        order
    })
})


exports.deleteOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.ID)
    if(!order){
        return next(new ErrorHandeler('Order is not Found',400))
    }

    await Order.findByIdAndDelete(req.params.ID)
})


exports.deleteUserOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.find({user:req.user._id})
    if(!order){
        return next(new ErrorHandeler('No Order is Found',400))
    }

    order.forEach(el =>{
        if(el._id !== req.params.ID){
            return next(new ErrorHandeler('Order is not found',400))
        }
    })

    await Order.findByIdAndDelete(req.params.ID)
     res.status(200).json({
         success:true,
         msg:'Order deleted Successfully'
     })
})


exports.updateOrder = catchAsyncError(async(req,res,next)=>{
    const order = await Order.findById(req.params.ID)

    if(order.orderStatus  == 'delivered'){
        return next(new ErrorHandeler('No Order Found',400))
    }

    order.orderItems.forEach(async (ord)=>{
        await updateStock(ord.product, ord.quantity)
    })

    order.orderStatus = req.body.status
    
    if(req.body.status === 'delivered'){
        order.deleveredAt = Date.now()
    }

    await order.save({validateBeforeSave:false})
    res.status(200).json({
        success:true
    })
})

async function updateStock(id,qunt){
    const product =await Product.findById(id)
    if(!product){
        return next(new ErrorHandeler('No Product is Found',400))
    }

    product.stock -= qunt

    await product.save({validateBeforeSave:false})
}