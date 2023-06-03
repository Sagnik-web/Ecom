const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Name Is required'],
        maxLength:[30, 'Name Shoud not longer then 30 char'],
        minLength:[3, 'Name Shoud not less then 3 char']
    },
    email:{
        type:String,
        required:[true, 'Email Is required'],
        validate:[validator.isEmail,'Enter valid Email Address'],
        unique:[true,'Email must be unique']
    },
    password:{
        type:String,
        required:[true, 'Password Is required'],
        minLength:[8, 'Password Shoud not less then 8 char']
    },
    role:{
        type:String,
        default:'user'
    },
    avater:{
        publicID:{
            type:String,
            required:true
        },
        img_url:{
            type:String,
            required:true
        }
    },
    
    resetpasswordtoken:String,
    expresetpasswordtoken:Date,
    createdAt:{
        type:Date,
        default:Date.now
    }
})

// Password Hash 
userSchema.pre('save',async function(next){
    if(!this.isModified){
        next()
    }

    this.password = await bcrypt.hash(this.password, 12)
    // next()
})

// Compare Password
userSchema.methods.comparePassword = function(currentPassword){
    return bcrypt.compare(currentPassword, this.password)
}

// Create JWT Token
userSchema.methods.getJWT = function(){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXP
    })
}

// set Reset Password token
userSchema.methods.getResetToken = function(){
    const randomByte = crypto.randomBytes(20).toString('hex')
    this.resetpasswordtoken = crypto.createHash('sha256').update(randomByte).digest('hex')
    this.expresetpasswordtoken = Date.now() + 15 * 60 * 1000 
    return randomByte
}

const User = mongoose.model('user', userSchema)

module.exports = User