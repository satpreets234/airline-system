const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    isVerified:{
        type:Boolean,
        default:false

    },
    customerId:{
        type:String,
        required:true
    },
    userType:{
        type:String,
        enum:['regular','flightCompany'],
        default:'regular'
    },
    companyName:{
        type:String,
        required: function(){
            return this.userType === 'flightCompany'
        }
    },
    companyCode:{
        type:String,
        required: function(){
            return this.userType === 'flightCompany'
        }
    },
    userImage:{ 
        type:String,
    required:false
}
})

userSchema.pre('save',async function (next){
    try {
    let newPassword=await bcrypt.hash(this.password,10);
    this.password=newPassword;
    next()
        
    } catch (error) {
        next(error)
    }
})

module.exports= mongoose.model('users',userSchema);