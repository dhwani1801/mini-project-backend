import nodemailer from "nodemailer";
import config from "../../config";

// Nodemailer transporter configuration
// const transporter = nodemailer.createTransport({
//   host: config.smtpHost,
//   port: Number(config.smtpPort),
//   secure: false,
//   auth: {
//     user: config.smtpEmailLogin,
//     pass: config.smtpPassword,
//   },
// });
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dhwanip18301@gmail.com',
        pass: 'wjrr vblf cpbf gwye',
    },
});
// Send Email
const sendEmail = async (options: nodemailer.SendMailOptions): Promise<any> => {
  await transporter.sendMail(options);
};

export default sendEmail;
