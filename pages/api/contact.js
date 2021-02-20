const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env?.MAILER_EMAIL || 'foo',
        pass: process.env?.MAILER_APP_PASS || 'bar'
    }
});

const contactFunction = (req, res) => {
    const { email, name, message, phone } = req.body;

    const currentDate = new Date();
    const monthYear = `${currentDate.getMonth()}/${currentDate.getFullYear()}`;

    // Step 2
    let mailOptions = {
        from: email,
        to: process.env?.DESTINATION_EMAIL,
        subject: `${name} - ${monthYear + 1}`,
        text: `Dear KeepForever.dev,

${message}

Thanks,
${name}
${email}
${phone}
`
    };

    // Step 3
    transporter.sendMail(mailOptions, (err, data) => {
        if (err) {
            return res.status(500).json({
                message: 'Internal Server Error'
            });
        }
        return res.status(200).json({
            message: 'Email Sent Successfully'
        });
    });
};

export default contactFunction;
