const mongoose =require('mongoose');
const bookingModel = require('./booking-model');

const transactionModel= new mongoose.Schema({
    data:{
        
    }
})

module.exports = mongoose.model('transaction',transactionModel);