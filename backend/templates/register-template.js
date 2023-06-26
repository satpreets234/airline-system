const registerTemplate = (payload,link) =>{
    return `<!DOCTYPE html>
<html>
<head>
    <title>Welcome to Our Application</title>
    <style>
    body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        padding: 20px;
    }

    .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 30px;
        border-radius: 5px;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    h1 {
        color: #333333;
        font-size: 24px;
        margin-bottom: 20px;
    }

    p {
        color: #555555;
        font-size: 16px;
        margin-bottom: 20px;
    }

    .cta-button {
        display: inline-block;
        background-color: #007bff;
        color: #ffffff;
        padding: 10px 20px;
        font-size: 16px;
        text-decoration: none;
        border-radius: 5px;
    }

    .footer {
        margin-top: 30px;
        text-align: center;
        color: #888888;
    }
    </style>
</head>
<body>
<div class="container">
<h1>Welcome to Our Application!</h1>
<p>Dear ${payload.email},</p>
<p>
    Thank you for joining our application. We are excited to have you on board!
</p>
<p>Cllick the below link to verify your account and sign in to it.</p>
<p>
    ${link}
</p>
<p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer id nisi ultrices,
    bibendum urna in, ultricies ipsum. Suspendisse interdum, est sit amet facilisis
    convallis, tortor neque aliquet enim, sed ullamcorper nulla nulla et justo.
</p>
<p>
    Get started by exploring our features and making the most of your experience.
    If you have any questions or need assistance, please feel free to contact our support team.
</p>
<p>
    <a class="cta-button" href="http://localhost:8540:3000/">Start Exploring</a>
</p>
<div class="footer">
    <p>Best regards,</p>
    <p>The Application Team</p>
</div>
</div>
</body>
</html>`
}

module.exports = registerTemplate;