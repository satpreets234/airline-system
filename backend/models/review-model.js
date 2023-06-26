const mongoose=require('mongoose');
const {Types,Schema} =require('mongoose');
const userModel = require('./user-model');
const reviewModel=new mongoose.Schema({
    stars:{
        type:Number,
        required:true
    },
    reviewText:{
        type:String,
        required:true
    }
})
const reviewSchema=new mongoose.Schema({
    reviewerId:{
        type:Types.ObjectId,
        validator:{
            validate: async function checkReviewer(value){
                const user=await userModel.findOne({_id:value});
                return user !==null;
            },
            message:'User not found in db'
        },
        ref:'users'
    },
    airlineCompanyId:{
        type:Types.ObjectId,
        validator:{
            validate: async function checkAirline(value){
                const airline=await userModel.findOne({_id:value});
                return airline !==null;
            },
            message:'airline not found in db'
        },
        ref:'users'
    },
    reviewData:reviewModel
});

reviewSchema.index({ reviewerId: 1,
     airlineCompanyId: 1 },
      { unique: true });
module.exports =mongoose.model('reviews',reviewSchema);