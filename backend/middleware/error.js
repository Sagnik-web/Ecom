const ErrorHandeler = require("../utils/ErrorHandeler");

module.exports = (err,req,res,next) =>{
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal Server Error"

    res.status(err.statusCode).json({
        success:false,
        msg:err.message,
        error:err.stack
    })
} 