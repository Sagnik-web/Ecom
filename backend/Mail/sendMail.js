const nodemailer = require('nodemailer')

const sendEmail = async(options)=>{
    const transportMail = nodemailer.createTransport({
        host:process.env.MAIL_HOST,
        port:process.env.MAIL_PORT,
        service:process.env.MAIL_SERVICE,
        auth:{
            user:process.env.MAIL_USER,
            pass:process.env.MAIL_PASS
        }

    })

    const mailDetails = {
        from:process.env.MAIL_USER,
        to:options.email,
        subject:options.subject,
        text:options.text
    }

    await transportMail.sendMail(mailDetails)
}

module.exports = sendEmail