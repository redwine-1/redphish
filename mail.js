import nodemailer from "nodemailer";

const username = process.env.USERNAME;
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: username,
    pass: process.env.PASSWORD,
  },
});

function sendMAil(userInput, email) {
  const mailOptions = {
    from: username,
    to: email,
    subject: "verification code",
    text: userInput,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent to :" + email + info.response);
    }
  });
}

export default sendMAil;
