const successBooking =(payload,pdfLink) =>{
    return `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Flight Booking Confirmation</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
          }
          
          h1 {
            color: #333;
          }
          
          p {
            color: #555;
          }
          
          ul {
            list-style-type: none;
            padding: 0;
            margin: 0;
          }
          
          li {
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <h1>Flight Booking Confirmation</h1>
        <p>Dear ${payload.userId?.email},</p>
        <p>Your flight booking has been successfully confirmed. Below are the details of your booking:</p>
        
        <h2>Booking Details</h2>
        <ul>
          <li><strong>Booking ID:</strong> ${payload._id}</li>
          <li><strong>User Name:</strong> ${payload.userId?.email}</li>
          <li><strong>Flight Name:</strong> ${payload.flightId?.flightName}</li>
          <li><strong>Origin:</strong>${payload.origin}</li>
          <li><strong>Destination:</strong> ${payload?.destination}</li>
          <li><strong>Seat Type:</strong> ${payload.seatDetails?.seatType}</li>
          <li><strong>Number of Seats:</strong> ${payload.seatDetails?.seatCount}</li>
          <li><strong>Amount:</strong> ${payload.amount?.price/100}</li>
        </ul>
        <h2>Invoice Pdf Link</h2>
        <p><a>http://localhost:8540/${pdfLink}</a></p>
        <p>Thank you for choosing our flight booking service. If you have any further questions or need assistance, please feel free to contact our customer support.</p>
        
        <p>Best regards,</p>
        <p>Your Flight Booking Team</p>
      </body>
    </html>`
}

module.exports = successBooking;