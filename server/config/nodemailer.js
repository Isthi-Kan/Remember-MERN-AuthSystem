import nodemailer from "nodemailer"; //This brings the Nodemailer package into your backend.

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, //This tells Nodemailer:Which email server I connect.(Brevo)
    port: Number(process.env.SMTP_PORT),
    auth: {  //auth means authentication/login details: "Here are my credentials for the email server."
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export default transporter;