const bookingModel = require("../models/booking-model");
const transactionModel = require("../models/transaction-model");

const addTransaction =async (req,res) =>{
    try {
        // Extract the payload from the request body
        const payload = req.body;
    req.body.airlineName=req.user._id;
        // Create a new flight object using the payload
        const transactionDetail = new transactionModel({data:payload});
        // Save the flight to the database
        const savedTransaction = await transactionDetail.save();
    if(savedTransaction){
       const transactionStored= await bookingModel.updateOne({_id:req.body.bookingId},{transactionId:savedTransaction._id})
        if(transactionStored.modifiedCount>0){
            res.status(201).json(savedTransaction);

        }
    }
      } catch (error) {
        console.error('Error creating transaction:', error);
        await bookingModel.deleteOne({_id:req.body.bookingId});
        res.status(500).json({ error: 'Failed to create transaction' });
      }
   
}

module.exports = {addTransaction}