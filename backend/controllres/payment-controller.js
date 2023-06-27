const crypto=require('crypto');
const bookingModel = require('../models/booking-model');
const successfulBookingTemplate=require('../templates/successful-booking');
const { sendMail ,transporter} = require('../services/node-mail');
const bookingPdfModel = require('../models/booking-pdf-model');
const axios=require('axios');
const completePayment = async(req,res) =>{
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign= razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString()).digest("hex")
    if (razorpay_signature === expectedSignature) {
        try {
            const bookingId = req.body.notes.bookingId;
            const bookingDetails= await bookingModel.updateOne({_id:bookingId},{completedPayment:true},{new:true})
            const bookingData= await bookingModel.findOne({_id:bookingId})
            .populate('userId').populate('flightId');
            var mailOptions = {
                from: process.env.NODEMAILER_EMAIL,
                to: bookingData?.userId?.email,
                subject: `Flight Booking successful`,
                html: successfulBookingTemplate(bookingData)
            };
            const mailDetails= await sendMail(transporter,mailOptions);

            return res.status(200).json({ message: "Payment verified successfully" });  
        } catch (error) {
            console.log(error);
            return res.status(403).send(error)
       }
    } else {
        return res.status(400).json({ message: "Invalid signature sent!" });
    }

}

module.exports ={
    completePayment
}