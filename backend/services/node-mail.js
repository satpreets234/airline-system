const nodemailer=require('nodemailer');
const transporter=nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:'satpreet410@gmail.com',
        pass:'upfuwxqnwyfbuwub'
    }
})

const sendMail = async (transporter,mailOptions) => {
    try {
        const mailDetail=await transporter.sendMail(mailOptions);
          return mailDetail?.messageId; 
    } catch (error) {
        return null;
    }
    
}

const mailOptions = (toEmail,subject,template,mailData) => {
   return { from: process.env.NODEMAILER_EMAIL,
    to:toEmail,
    subject:subject,
    html: template(mailData) }
};
module.exports={transporter,sendMail,mailOptions}





