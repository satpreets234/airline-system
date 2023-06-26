const cron =require('node-cron');
const bookingModel = require('../models/booking-model');
const incompletePaymentTemplate=require('../templates/incomplete-payment-template');
const {transporter,mailOptions,sendMail} =require('../services/node-mail')

cron.schedule('0 0 * * *', async ()=>{
    try {
        console.log(1);
        const incompleteBooking= await bookingModel.find({completedPayment:false}).populate("userId","email userType")
        .populate('flightId').populate('transactionId')
        incompleteBooking.forEach(async (booking)=>{
        
            const mailData=mailOptions(booking?.userId?.email,'Incomplete payment for a flight booking',incompletePaymentTemplate,booking);
            await sendMail(transporter, mailData);
        })
    } catch (error) {
        console.log(error);
    }
})