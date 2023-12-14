import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dhwanip18301@gmail.com",
    pass: "wjrr vblf cpbf gwye",
  },
});

const sendEmail = async (options: nodemailer.SendMailOptions): Promise<any> => {
  await transporter.sendMail(options);
};

export default sendEmail;
