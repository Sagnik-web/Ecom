const mongoose = require('mongoose')

const DBConnect = ()=>{
    const DB = process.env.DB_URL
    mongoose.connect(DB,{
        useNewUrlParser: true, 
        useUnifiedTopology: true
    })
    .then(()=>{
        console.log("Database Connected Successfully");
    })
    .catch((err)=>{
        console.log("Database Error: "+err);
    })
}

module.exports = DBConnect