const mongoose=require('mongoose');
const {Types,Schema}=require('mongoose');
const userModel = require('./user-model');
const flightModel = require('./flight-model');

const seatSchema= new mongoose.Schema({
    seatType:{
        type:String,
        required:true,
        enum:['Business',"Premium",'Economy']
    },
    seatCount:{
        type:String,
        default:1
    }
})
const priceSchema= new mongoose.Schema({
    price:{
        type:Number,
        required:true,
    },
    currency:{
        type:String,
       enum:['INR',"USD"]
    }
})
const booking= new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'users',
        validate:{
            validator: async function(value){
                    const user= await userModel.findOne({_id:value})
                    return user !== null;
            },
            message:'User not found in db'
        }
    },
    flightId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:'flights',
        validate:{
            validator: async function(value){
                    const flight= await flightModel.findOne({_id:value})
                    return flight !== null;
            },
            message:'Booked flight not found in db'
        }
    },
    origin:{
        type:String,
        required:true
    },
    destination:{
        type:String,
        required:true
    },
    seatDetails:seatSchema,
    completedPayment:{
        type:Boolean,
        default:false
    },
    amount:priceSchema,
    transactionId:{
        type:Types.ObjectId,
        ref:'transaction'
    }
})

module.exports= mongoose.model('bookings',booking)