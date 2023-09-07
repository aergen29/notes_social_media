const sendEmail = require("./mailer");

const sendMail = async (resetPasswordToken,user)=>{

    const resetPasswordUrl = `http://localhost:3000/resetpassword/${resetPasswordToken}`;
    const emailTemplate = `
    <div style="text-align:center;">
    <h3>Hello ${user.name} (${user.username})</h3>
    <br/>
    <br/>
    <p>You can reset your password in <a href="${resetPasswordUrl}">here</a>.</p>
    <br/>
    <p style="color:red;">You can use this url just one time!</p>
    <br/>
    <p>If this link was not working, you should go ${resetPasswordUrl}</p>
    </div>
    `;

    await sendEmail({
        from:process.env.SMTP_USER,
        to:user.email,
        subject:'Reset Password',
        html:emailTemplate
    })    
}

module.exports = sendMail;