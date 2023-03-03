require("dotenv").config();
const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

// Handle POST request to '/inquiry'
router.post("/", async (req, res) => {
  const {
    companyName,
    contactName,
    contactEmail,
    message,
    timeFrame,
    phoneNumber,
  } = req.body;

  // Validate form data
  if (
    !companyName ||
    !contactName ||
    !contactEmail ||
    !message ||
    !timeFrame ||
    !phoneNumber
  ) {
    return res.status(400).send("Please fill in all fields.");
  }

  try {
    // Create a nodemailer transporter object
    const transporter = nodemailer.createTransport({
      service: "Hotmail",
      auth: {
        user: "digitalimpactbuilders@hotmail.com",
        pass: process.env.HOTMAIL_PASSWORD,
      },
    });

    // Define email options
    const mailOptions = {
      from: "digitalimpactbuilders@hotmail.com",
      to: "simont.codes@gmail.com", //this might be replaced later
      subject: "New project inquiry",
      html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              font-size: 16px;
              line-height: 1.5;
              margin: 0;
              padding: 0;
            }
  
            h1 {
              font-size: 28px;
              margin-bottom: 16px;
            }
  
            p {
              margin: 0;
              margin-bottom: 8px;
            }
  
            strong {
              font-weight: bold;
            }
  
            blockquote {
              margin: 0;
              margin-left: 16px;
              border-left: 4px solid #ccc;
              padding: 8px;
            }
          </style>
        </head>
        <body>
          <h1>New Inquiry from Your Website</h1>
          <p><strong>Company Name:</strong> ${companyName}</p>
          <p><strong>Contact Name:</strong> ${contactName}</p>
          <p><strong>Contact Email:</strong> ${contactEmail}</p>
          <p><strong>Phone Number:</strong> ${phoneNumber}</p>
          <p><strong>Timeframe:</strong> ${timeFrame}</p>
          <p><strong>Message:</strong></p>
          <blockquote>${message}</blockquote>
        </body>
      </html>
    `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Return a success response
    res.status(200).send("Your inquiry has been sent. Thank you!");
  } catch (error) {
    // Return an error response if sending the email fails
    console.error(error);
    res
      .status(500)
      .send(
        "There was a problem sending your inquiry. Please try again later."
      );
  }
});

module.exports = router;
