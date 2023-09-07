const sendEmail = require("./mailer");

const sendHelloMail = async (user)=>{

    const emailTemplate = `
    <div style="text-align:center;">
    <h2>Hello ${user.name} (${user.username})</h2>
    <br/>
    <br/>
    <h3 style="color:darkred;">Welcome to NOTES.</h3>
    <br/>
    <br/>
    <a style="color:gray; text-decoration:none;" href="http://localhost:3000">Notes</a>
    </div>
    `;

    await sendEmail({
        from:process.env.SMTP_USER,
        to:user.email,
        subject:'Welcome',
        html:emailTemplate
    })    
}

module.exports = sendHelloMail;