const nodemailer = require("nodemailer");

module.exports = async ({ from, to, subject, text, html}) => {
  let transporter = nodemailer.createTransport({
    service:process.env.SMTP_SERVICE,
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
        user: process.env.SMTP_MAIL, 
        pass: process.env.SMTP_PASSWORD,
    },
});

    let info = await transporter.sendMail({
        from: `SpeedShare <${from}>`, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line
        text: text, 
        html: html, 
    });
}