const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SENDER_EMAIL,
            pass: process.env.SENDER_PASSWORD
        }
    });

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to,
        subject,
        text
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail };
