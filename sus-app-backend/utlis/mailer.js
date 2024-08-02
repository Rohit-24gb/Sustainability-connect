const nodemailer = require('nodemailer');

const sendOtpEmail = (email, otp) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'sustainabilityconnect.bpl@gmail.com',
            pass: 'qanl ukog fpax oyfn'
        }
    });

    let mailOptions = {
        from: 'sustainabilityconnect.bpl@gmail.com',
        to: email,
        subject: 'Your OTP for Password Reset',
        text: `Your OTP is ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Email sent: ' + info.response);
    });
}

module.exports = sendOtpEmail;