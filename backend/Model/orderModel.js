const mongoose = require('mongoose')

const  orderSchema = mongoose.Schema({
    shippingInfo:{
        address:{type:String,required:true},
        screet:{type:String,required:true},
        city:{type:String,required:true},
        pin:{type:String,required:true},
        phone:{type:String,required:true}
    },
    orderItems:[
        {
            name:{type:String,required:true},
            price:{type:Number,required:true},
            quantity:{type:Number,required:true},
            img:{type:String,required:true},
            product:{
                type:mongoose.Types.ObjectId,
                ref:'product',
                required:true
            }
    
        }
    ],
    paymentInfo:{
        id:{
            type:String,
            required:true
        },
        status:{
            type:String,
            required:true
        }
    },
    payedAt:{
        type:String,
        required:true
    },
    itemPrices:{
        type:Number,
        default:0
    },
    shippingCharge:{
        type:Number,
        default:0
    },
    tax:{
        type:Number,
        default:0
    },
    deleveredAt:{
        type:Date
    },
    orderStatus:{
        type:String,
        default:'processing'
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:'user'
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now
    }
})  

const Order = mongoose.model('order',orderSchema)

module.exports = Order