const catchAsyncError = require("../middleware/catchAsyncError")
const Product = require("../Model/productModel")
const ErrorHandeler = require("../utils/ErrorHandeler")


// product create -- Admin
exports.createProduct = catchAsyncError( async (req,res,next)=>{
    req.body.user = req.user._id
    const product = await Product.create(req.body)

    res.status(200).json({
        msg:"Product Created Successfully",
        product
    })
})


// Get All Product
exports.getAllProduct = catchAsyncError( async(req,res,next)=>{
    const product = await Product.find()

    res.status(200).json({
        msg:"All Product Get Successfully.",
        product
    })
})


// Get One Poduct By ID
exports.getOneProduct = catchAsyncError( async(req,res,next)=>{
    const product = await Product.findById(req.params.ID)

    if(!product){
       return next(new ErrorHandeler("Product Not Found",400))
    //    res.status(400).json({
    //         msg:"Product Not Found"
    //     })
    }

    res.status(200).json({
        msg:"The Product Found Successfully",
        product
    })
})


// Update Product By ID --Admin
exports.updateProduct = catchAsyncError( async(req,res,next)=>{
    let product = await Product.findById(req.params.ID)

    if(!product){
        return next(new ErrorHandeler("Product Not Foud", 400))
        //  res.status(400).json({
        //     msg:"Product Not Foud"
        // })
    }

    product = await Product.findByIdAndUpdate(req.params.ID,req.body,{
        new:true,
        runValidators:true
    })
    
    res.status(200).json({
        msg:"Successfully Updated Product",
        product
    })
})


// Delete Product By ID --Admin
exports.deleteProduct = catchAsyncError( async(req,res,next)=>{
    let product = await Product.findById(req.params.ID)

    if(!product){
        return next(new ErrorHandeler("Product Not Foud", 400))

    }

    product = await Product.findByIdAndDelete(req.params.ID)

    res.status(200).json({
        msg:"Successfully Deleted Product"
    })
})


exports.sendReviews = catchAsyncError(async(req,res,next)=>{
    const {rating, comment, productId} = req.body

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating:Number(rating),
        comment
    }

    const product = await Product.findById(productId)

    const isReviewed = product.review.find(
        (rev)=> rev.user.toString() === req.user._id.toString()
    )

    if(isReviewed){
        product.review.forEach((rev)=>{
            if(rev.user.toString() === req.user._id.toString())
                (rev.rating = rating),(rev.comment = comment)
        })
    } else{
        product.review.push(review)
        product.number_of_reviews = product.review.length
    }

    let avg = 0
    product.review.forEach((rev)=>{
        avg += rev.rating
    })    

    product.rating = avg/product.review.length

    await product.save({validateBeforeSave: false})

    res.status(200).json({
        success:true,
        msg:"Review Send Successfully."
    })
})



exports.getProductReviews = catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.params.ID)

    if(!product){
        return next(new ErrorHandeler('Review not Found',400))
    }

    res.status(200).json({
        success:true,
        reviews:product.review
    })
})


exports.removeReviews = catchAsyncError(async(req,res,next)=>{
    const product = await Product.findById(req.params.productID)

    if(!product){
        return next(new ErrorHandeler('Review not Found',400))
    }


    const reviews = product.review.filter(rev => rev._id.toString() !== req.params.ID.toString())

    let avg = 0
    reviews.forEach((rev)=>{
        avg += rev.rating
    })

    let rating = 0
    if(reviews.length !== 0){
        rating = Number(avg / reviews.length)
    }

    const numOfReviews = reviews.length

    // console.log(avg,rating, numOfReviews);

    await Product.findByIdAndUpdate(req.params.productID,{
        review:reviews,
        rating,
        number_of_reviews:numOfReviews
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })

    res.status(200).json({
        success:true,
        msg:"Review is deleted Successfully"
    })
})