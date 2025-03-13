const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({

  service: "gmail",
  auth: {
    user: process.env.NODE_SENDING_EMAIL_ADDRESS,
    pass: process.env.NODE_SENDING_EMAIL_PASSWORD,
  },
});

// transport.verify((error, success) => {
//   if (error) {
//     console.error("Transporter Error:", error);
//   } else {
//     console.log("Server is ready to take messages");
//   }
// });


module.exports=transport;