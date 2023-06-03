module.exports = async (user, statusCode, res)=>{
    const token = await user.getJWT()
    const options ={
        httpOnly:true,
        expires:new Date(
            Date.now() + process.env.TOKEN_EXP * 24 * 60 * 60 * 1000
        )
    }

    res.status(statusCode).cookie('ecomAuth',token,options).json({
        success:true,
        msg:'Successfully Logged in'
    })
}