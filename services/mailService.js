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

    let options = await transporter.sendMail({
        from: `SpeedShare <${from}>`,
        to: to, 
        subject: subject, 
        text: text, 
        html: html,
    });

  transporter.sendMail(options, function (err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
}