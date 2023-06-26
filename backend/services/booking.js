const bookingModel=require('../models/booking-model');
const axios=require('axios');
const razorpay = require('../routers/razorpay');
const stripe=require('stripe')(process.env.STRIPE_SECRET_KEY)
const findBooking = async (bookingId) =>{
    try {
        const bookingDetails= await bookingModel.findOne({_id:bookingId})
    .populate('flightId').populate('userId',' _id email userType ').populate('transactionId');
    
    if(bookingDetails){
        return bookingDetails;
    }else{
        return new Error('Not found!')
    }
    } catch (error) {
        return error
    }
    
}

const getAllBookings = async (userId='',flightId='') =>{
    try {
        let bookingDetails;
        if(!userId){
             bookingDetails= await bookingModel.find({flightId})
            .populate('flightId').populate('userId',' _id email userType ').populate('transactionId');
        } else if(!flightId){
             bookingDetails= await bookingModel.find({userId})
            .populate('flightId').populate('userId',' _id email userType ').populate('transactionId');
        } else {
             bookingDetails= await bookingModel.find({})
            .populate('flightId').populate('userId',' _id email userType ').populate('transactionId');
        }
        if(bookingDetails){
            return bookingDetails;
        }else{
            return new Error('Not found!')
        }
    } catch (error) {
        return error;
    }
    
}

const deleteBooking = async (bookingId,userId) =>{
    try {
        const bookingDelete= await bookingModel.deleteOne({_id:bookingId, userId});
        if(bookingDelete.deletedCount>0){
            return true;
        }else{
            return new Error('Unauthorized access');
        }
    } catch (error) {
        return error
    }
   
}

const newBooking = async (payload) =>{
    try {
        const alreadyBooking= await bookingModel.findOne(payload);
        if(alreadyBooking){
            return new Error('Duplicate entry !')
        } else{
            const bookingDetails= new bookingModel(payload);
            const bookingData= await bookingDetails.save();
            if(bookingData._id!==null && bookingData?.amount?.currency=='INR'){
                const options = {
                    amount: bookingDetails.amount?.price,
                    currency:  bookingDetails.amount?.currency,
                    receipt: 'receipt_' + Date.now(),
                    notes: {
                        bookingId: bookingData._id.toString(), // Include the booking ID in the notes field
                      }
                  };
                let paymentLink=await razorpay.orders.create(options)
                return paymentLink;}
            // }else if(bookingData._id!==null && bookingData?.amount?.currency=='USD'){
            //     const address = {
            //         line1: '123 Main Street',
            //         line2: 'Apt 4B',
            //         city: 'New York',
            //         state: 'NY',
            //         postal_code: '10001',
            //         country: 'US',
            //       };
                  
            //       const paymentMethod = await stripe.paymentIntents.create({
            //         amount: 1000,
            //         currency: 'usd',
            //         payment_method_types: ['card'],
            //         description: 'Export of goods',
            //         customer: 'cus_O1ampwIqBMUPWI'
            //       });
            //       console.log(paymentMethod);
            //       return `${paymentMethod.id}_secret_${paymentMethod.client_secret}`;

            // }
            else {
                return new Error('Cannot create')
            }
        }
   
        
    } catch (error) {
        console.log(error);
        return error;
    }
}

module.exports ={
    newBooking,getAllBookings,deleteBooking,findBooking
}