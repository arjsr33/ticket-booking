const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS // This should be your app password
  },
  debug: true, // Enable debug logging
  logger: true // Enable logger
});

const sendBookingConfirmationEmail = async (userEmail, bookingDetails) => {
  const { movieTitle, seats, date, time, totalPrice } = bookingDetails;

  try {
    console.log('Attempting to send email to:', userEmail);
    console.log('Using email:', process.env.EMAIL_USER);

    let info = await transporter.sendMail({
      from: `"Your Cinema" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "Booking Confirmation",
      text: `Thank you for your booking!\n\nMovie: ${movieTitle}\nSeats: ${seats.join(', ')}\nDate: ${date}\nTime: ${time}\nTotal Price: ₹${totalPrice}\n\nPlease arrive one hour early to make the payment and confirm your booking.`,
      html: `<h1>Thank you for your booking!</h1><p><strong>Movie:</strong> ${movieTitle}<br><strong>Seats:</strong> ${seats.join(', ')}<br><strong>Date:</strong> ${date}<br><strong>Time:</strong> ${time}<br><strong>Total Price:</strong> ₹${totalPrice}</p><p>Please arrive one hour early to make the payment and confirm your booking.</p>`,
    });

    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error('SMTP Response:', error.response);
    }
    throw error; // Throw the error so it can be caught in the route handler
  }
};

module.exports = {
  sendBookingConfirmationEmail
};