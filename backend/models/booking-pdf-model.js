const mongoose =require('mongoose');
const bookingModel = require('./booking-model');
const userModel = require('./user-model');

const bookingPdfModel= new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        validator:{
            validate: async function checkReviewer(value){
                const user=await userModel.findOne({_id:value});
                return user !==null;
            },
            message:'User not found in db'
        },
        ref:'users'
    },
    bookingId:{
        type:mongoose.Types.ObjectId,
        validator:{
            validate: async function checkReviewer(value){
                const booking=await bookingModel.findOne({_id:value});
                return booking !==null;
            },
            message:'booking not found in db'
        },
        ref:'bookings'
    },
    fileName:{
        type:String,
        required:true
    },
    filePath:{
        type:String,
        required:true
    },
})

module.exports = mongoose.model('bookingPdf',bookingPdfModel);