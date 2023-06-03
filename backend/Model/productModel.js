const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,"Product name required."]
    },
    desc:{
        type:String,
        required:[true,"Product description required."]
    },
    price:{
        type:Number,
        required:[true,"Product Price required."],
        maxLength:[8,"You Are not Allowed to enter more then 8 digit"]
    },
    stock:{
        type:Number,
        required:[true,"Product Stock required."],
        maxLength:[8,"You Are not Allowed to enter more then 8 digit"],
        default:1
    },
    tag:{
        type:String,
        required:[true,"Product Tag required."]
    },
    img:[
        {
            publicId:{
                type:String,
                required:[true,"Product ID Required."]
            },
            img_url:{
                type:String,
                required:[true,"Image Url Required."]
            }
        }
    ],
    rating:{
        type:Number
    },
    number_of_reviews:{
        type:Number,
        default:0
    },
    review:[
        {
            user:{
                type:mongoose.Types.ObjectId,
                ref:'user',
                required:true
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true
            },
            comment:{
                type:String,
                required:true
            }
        }
    ],
    user:{
        type:mongoose.Types.ObjectId,
        ref:'user',
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

const Product  = mongoose.model('product',productSchema)

module.exports = Product