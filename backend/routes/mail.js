const express = require('express');
const app = express();
const nodemailer = require("nodemailer");
const router = express.Router();
const bodyParser = require('body-parser');
const fetchuser = require("../middleware/fetchuser");

// Middleware to parse JSON data


// Endpoint to handle email sending
router.post('/email',async (req, res) => {
  const { email, subject, message } = req.body;

  try {
    
    const transporter = nodemailer.createTransport({
      
      service: "gmail",
      auth: {
          user: 'easygoiiitdmj@gmail.com',
          pass: 'dyaguwbjpwlvdicl'
      }
    });

    // Configure the email options
    const mailOptions = {
      from: 'easygoiiitdmj@gmail.com',
      to: email,
      subject: subject,
      text: message,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
          console.log("error", error);
          res.status(400).json({ error: "email not send" })
      } else {
          console.log("Email sent", info.response);
          res.status(200).json({ message: "Email sent Successfully" })
      }
  })

    // Return a success response
    res.status(200).json({ message: 'Email sent successfully!' });
  } catch (error) {
    // Return an error response
    res.status(500).json({ error: 'Failed to send email.' });
  }
});

module.exports = router;