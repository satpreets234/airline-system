const mongoose =require('mongoose');
const userModel = require('./user-model');

const cardSchema= new mongoose.Schema({
    cardNumber:{
        type:String,
        required:true
    },
    expiryDate:{
        type:Date,
        required:true,
        validate:{
            validator: async function(value){
                    return value > Date.now();
            },
            message:'Please provide valid date!'
        }
    },
    cvvNumber:{
        type:Number,
        required:true
    }
})

const addressSchema= new mongoose.Schema({
    address:{
        addressLine1:{
            type:String,
            required:true
        },
        addressLine2:{
            type:String,
            required:true
        }
    },
    city:{
        type:String,
        required:true
    },
    state:{
        type:String,
        required:true
    },
    postalCode:{
        type:Number,
        required:true
    },
    country:{
        type:String,
        required:true
    }
})

const billingSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'users',
        validate:{
            validator:async function checkUser(value){
                return userModel.findOne({_id:value}) !== null
            },
            message:"user not found in db"
        }
    },
    addressDetails: {
        type: addressSchema,
        required: function () {
          // Address details are required only if card details are not present
          return !this.cardDetails;
        },
      },
      cardDetails: {
        type: cardSchema,
        required: function () {
          // Card details are required only if address details are not present
          return !this.addressDetails;
        },
      },
})

module.exports =mongoose.model('billingSchema',billingSchema)