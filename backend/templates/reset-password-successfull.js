const resetPasswordSuccess = (payload ) =>{
    return `<!DOCTYPE html>
    <html>
    <head>
      <title>Password Reset</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        h2 {
          margin-top: 0;
        }
        p {
          margin-bottom: 20px;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #007bff;
          color: #fff;
          text-decoration: none;
          border-radius: 4px;
        }
        .button:hover {
          background-color: #0056b3;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Password Reset</h2>
        <p>Hello, ${payload?.email}</p>
        <p>You have successfully reset your password. Click the button below to login:</p>
        <p><a class="button" href=${process.env.FRONTEND_SITE_URL}login>Login Link</a></p>
        <p>Best regards,<br>Airline Team</p>
      </div>
    </body>
    </html>`
}

module.exports =resetPasswordSuccess;