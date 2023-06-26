const mongoose = require('mongoose');
const User= require('./user-model')

const seatSchema=new mongoose.Schema({
    totalSeats:{
        type:Number,
        required:true
    },
    priceDetail:{
        type:Number,
        required:true
    }
})
const flightSchema = new mongoose.Schema({
    flightName:{
        type:String,
        required:true
    },
    airlineName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'users',
        validate:{
            validator: async function (value){
                const airlineExist= await User.findOne({_id:value});
                return airlineExist !== null
            } ,
            message:'Please provide valid airline'
        } 
    },
    scheduledDate:{
        type:Date,
        required:true
    },
    arrivalTime:{
        type:Date,
        required:true
    },
    departureTime:{
        type:Date,
        required:true
    },
    origin:{
        type:String,
        required:true
    },
    destination:{
        type:String,
        required:true
    },
    seatsAvailable: [
            {
              type: {
                type: String,
                enum: ['Business', 'Economy', 'Premium'],
                required: false,
              },
              seatDetail: seatSchema,
            }
          ]
})
module.exports = mongoose.model('flights',flightSchema)