const nodeMailer = require("nodemailer");
// load env
const dotenv = require("dotenv");
dotenv.config();

const defaultEmailData = { from: "noreply@node-react.com" };

exports.sendEmail = (emailData) => {
  const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: `${process.env.EMAIL_SENDER}`,
      pass: `${process.env.EMAIL_PASS}`,
    },
  });
  return transporter
    .sendMail(emailData)
    .then((info) => console.log(`Message sent: ${info.response}`))
    .catch((err) => console.log(`Problem sending email: ${err}`));
};
