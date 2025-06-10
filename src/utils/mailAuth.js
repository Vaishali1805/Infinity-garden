import nodemailer from 'nodemailer';

async function sendEmail(mail) {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS,
            },
        });

        const otp = await getRandomFourDigit();

        await transporter.sendMail({
            from: process.env.GMAIL_USER,
            to: mail,
            subject: "OTP Verification",
            text: `This is your OTP: ${otp} for verification. Please don't share this with anyone.`,
        });

        console.log("OTP sent:", otp);
        return otp.toString();
    } catch (error) {
        console.error("Email sending failed:", error);
        throw error;
    }
}

async function getRandomFourDigit() {
    return Math.floor(1000 + Math.random() * 9000);
}

export default sendEmail;
