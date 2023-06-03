const sendCookie = require("../Cookie/sendCookie");
const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../Model/userModel");
const ErrorHandeler = require("../utils/ErrorHandeler");
const jwt = require('jsonwebtoken');
const sendEmail = require("../Mail/sendMail");
const crypto = require('crypto')

// Create User Account --Register
exports.createUser = catchAsyncError(async (req,res,next)=>{
    const user =await User.create(req.body)

    res.status(200).json({
        success:true,
        msg:"User Created Successfully",
        user
    })
})


// Login
exports.login = catchAsyncError(async (req,res,next)=>{
    const {email, password} = req.body

    if(!email || !password){
        return next(new ErrorHandeler("You need to enter email and password",500))
    }

    const user = await User.findOne({email}).select('+password')
    if(!user){
        return next(new ErrorHandeler("User not Found",500))
    }

    const checkPassword = await user.comparePassword(password)
    if(!checkPassword){
        return next(new ErrorHandeler("Wrong Password",500))
    }

    
    sendCookie(user,200,res)
    
})


// Logout
exports.logout =catchAsyncError( (req,res, next)=>{
    res.cookie('ecomAuth',null)

    res.status(200).json({
        success:true,
        msg:"Logout Successfully"
    })
})


// Protect 
exports.protect = catchAsyncError(async(req,res,next)=>{
  const {ecomAuth} = req.cookies
//   console.log(req.cookies);
  if(!ecomAuth){
      return next(new ErrorHandeler("Cookies not Found", 500))
  }

  const decode = jwt.verify(ecomAuth,process.env.JWT_SECRET)
  if(!decode.id){
      return next(new ErrorHandeler("No ID Found", 500))
  }

  req.user =await User.findById(decode.id)
  next() 
})


// Role Protection
exports.roleAuth = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            next(new ErrorHandeler('You Are Not Allowed this Section',500))
        }
        next()
    }
}


// Forgot password
exports.forgotPassword = catchAsyncError(async(req,res,next)=>{
    const {email} = req.body
    if(!email){
        return next(new ErrorHandeler("You Need to enter Email Address.",500))
    }

    const user = await User.findOne({email:email})
    if(!user){
        return next(new ErrorHandeler("Email is Not Found", 500))
    }
    // console.log(user);

    const resetToken = user.getResetToken()
    // console.log(resetToken);
    await user.save({validateBeforeSave:false})

    const subject = "Reset Token By Company"
    const message = `Your Reset Token Is \n ${req.protocol}://${req.get('host')}/api/v1/user/resetToken/${resetToken}.`

    try{
       
        await sendEmail({
            email:email,
            subject:subject,
            text:message
        })

        res.status(200).json({
            success:true,
            msg:"Reset Token Send to Email "
        })
    }catch(error){
        user.resetpasswordtoken = undefined
        user.expresetpasswordtoken = undefined
        await user.save({validateBeforeSave:false})
        next(new ErrorHandeler(`Reset Token is not Send to Email Yet ${error.message}`, 500))
    }
})


// Reset Password
exports.resetPassword = catchAsyncError(async(req,res,next)=>{
    const {resetToken} = req.params
    if(!resetToken){
        return next(new ErrorHandeler('Reset Token Not Found', 500))
    }

    const cryptoToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    
    const user = await User.findOne({
        resetpasswordtoken:cryptoToken,
        expresetpasswordtoken:{ $gt:Date.now() }
    })

    if(!user){
        return next(new ErrorHandeler('User is not Found',500))
    }

    const {password} = req.body
    if(!password){
        return next(new ErrorHandeler('Password not Found'))
    }

    user.password = password,
    user.resetpasswordtoken = undefined
    user.expresetpasswordtoken = undefined
    user.save()

    res.status(200).json({
        success:true,
        msg:"User Password Changed Successfully"
    })


})


// All Users --Admin
exports.allUsers =  catchAsyncError(async(req,res,next)=>{
    const users = await User.find()
    
    res.status(200).json({
        success:true,
        msg:"Successfully get All Users",
        users
    })
})


// User Account --User
exports.userAccount = catchAsyncError(async(req,res,next)=>{
    res.status(200).json({
        success:true,
        msg:"Successfully get my Users",
        user:req.user
    })
})


// Update Password 
exports.updatePassword = catchAsyncError(async(req,res,next)=>{
    const {oldPassword, password} = req.body

    const user = await User.findById(req.user._id)
    if(!user){
        return next(new ErrorHandeler("User Not Found"))
    }

    const checkPassword =await user.comparePassword(oldPassword)
    if(!checkPassword){
        return next(new ErrorHandeler("You Entered Wrong Password"))
    }

    user.password = password
    await user.save()

    res.status().json({
        success:true,
        msg:"Your Password Updated Successfully."
    })

})

