const nodemailer = require('nodemailer');
const {SMTP_HOST,SMTP_PORT,SMTP_PASSWORD,SMTP_USER} = process.env;

const sendEmail = async(mailOptions)=>{
    let transporter = nodemailer.createTransport({
        host:SMTP_HOST,
        port:SMTP_PORT,
        auth:{
            user:SMTP_USER,
            pass:SMTP_PASSWORD
        }
    })

    let info = await transporter.sendMail(mailOptions)

}

module.exports = sendEmail;