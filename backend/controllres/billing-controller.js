const billingModel =require('../models/billing-model');
const postAddressDetails = async(req,res) =>{
    try {
        const{addressLine1,addressLine2,state,city,postalCode,country} =req.body
        if(!addressLine1 || !addressLine2 || !state || !city || !postalCode || !country){
        res.status(400).send("Please fill all details")
        }else{
            let addressDetails = {
                  address: {
                    addressLine1: addressLine1,
                    addressLine2: addressLine2,
                  },
                  city: city,
                  state: state,
                  country: country,
                  postalCode: postalCode,
                }
              

            const newBillingDetails = new billingModel({userId:req.user._id, addressDetails})
            const billingdetailsSave=await newBillingDetails.save();
            if(billingdetailsSave){
                res.status(200).send(newBillingDetails)
            }else{
                res.status(406).send('Cannot Create')
            }
    } 
 } catch (error) {
    console.log(error);
        res.status(500).send(error)
    }
}

const postCardDetails = async(req,res) =>{
    try {
        console.log(req.body);
        const{cardNumber,cvvNumber,expiryDate} =req.body
        if(!cardNumber || !cvvNumber || !expiryDate ){
        res.status(400).send("Please fill all Card details")
        }else{
            let cardDetails = {cardNumber,cvvNumber,expiryDate}
              const addressDetails=await billingModel.findOne({userId:req.user._id})
              if(addressDetails){
                const updateBillingDetails = await billingModel.findOneAndUpdate({userId:req.user._id},{cardDetails},{new:true})
                if(updateBillingDetails.isModified){
                    res.status(200).send(updateBillingDetails)
                }else{
                    res.status(406).send('Cannot Update')
                }
              }else{
                res.status(404).send('Please add address details first !')
              }
        } 
} catch (error) {
    console.log(error);
        res.status(500).send(error)
    }
}
const deleteBillingDetails =(req,res) =>{
    try {
        
    } catch (error) {
        res.status(500).send(error) 
    }
}

const getBillingDetails = async(req,res) =>{
    try {
        const addressDetails=await billingModel.findOne({userId:req.user._id})
        if(addressDetails){
              res.status(200).send(addressDetails)
        }else{
            res.status(203).send('Not send yet!')
        }
    } catch (error) {
        res.status(500).send(error)   
    }
}

const updateBillingDetails =(req,res) =>{
    try {
        
    } catch (error) {
        res.status(500).send(error)
    }
}

module.exports ={
    postAddressDetails,deleteBillingDetails,updateBillingDetails,getBillingDetails,postCardDetails
}

