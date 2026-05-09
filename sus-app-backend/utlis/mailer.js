const nodemailer = require('nodemailer');

const sendOtpEmail = async (email, otp) => {
    if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
        throw new Error('MAIL_USER and MAIL_PASS must be configured');
    }

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.MAIL_FROM || process.env.MAIL_USER,
        to: email,
        subject: 'Your OTP for Password Reset',
        text: `Your OTP is ${otp}`
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendOtpEmail;
