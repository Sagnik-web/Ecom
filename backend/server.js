const app = require('./app')
const dotenv = require('dotenv')
const DBConnect = require('./DB_Connect/db_connect')

// connect Env Variable
dotenv.config()

process.on('uncaughtException', err=>{
    console.log(`Error ${err}`);
    process.exit(1)
})

// Database Connected
DBConnect()



// Running on Port
const port = process.env.PORT || 5000
const server = app.listen(port,()=>{
    console.log(`Server is running on port ${port}...`);
})

// unchached Error
process.on('unhandledRejection',err=>{
    console.log(`Error ${err}`);
    server.close(()=>{
        process.exit(1 )
    })
})