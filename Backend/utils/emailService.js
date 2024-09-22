const nodemailer = require('nodemailer');

// Create a transporter using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.mail.yahoo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendBookingConfirmationEmail = async (userEmail, bookingDetails) => {
  const { movieTitle, seats, date, time, totalPrice } = bookingDetails;

  try {
    // Send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Your Cinema" <bookings@yourcinema.com>',
      to: userEmail,
      subject: "Booking Confirmation",
      text: `Thank you for your booking!\n\nMovie: ${movieTitle}\nSeats: ${seats.join(', ')}\nDate: ${date}\nTime: ${time}\nTotal Price: ₹${totalPrice}\n\nPlease arrive one hour early to make the payment and confirm your booking.`,
      html: `<h1>Thank you for your booking!</h1><p><strong>Movie:</strong> ${movieTitle}<br><strong>Seats:</strong> ${seats.join(', ')}<br><strong>Date:</strong> ${date}<br><strong>Time:</strong> ${time}<br><strong>Total Price:</strong> ₹${totalPrice}</p><p>Please arrive one hour early to make the payment and confirm your booking.</p>`,
    });

    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = {
  sendBookingConfirmationEmail
};