const User = require('../models/user-model');
const flight= require('../models/flight-model');
const flightModel = require('../models/flight-model');
const { default: mongoose } = require('mongoose');

const getFlightDetails = async (req,res)=>{
    try {
        const flightId=req.params.flightId;
        const flightData=await flightModel.findOne({_id:flightId}).populate({path:'airlineName'});
        if(flightData){
            res.status(200).send(flightData);
        }else{
            res.status(404).send('Flight not found !')
    } }catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
}

const getAllFlightDetails = async (req, res) => {
  try {
    const { origin, destination, scheduledDate, passengerCount, selectedOption } = req.query;
    let query = {};
    if (origin) {
      query.origin = { $regex: origin, $options: 'i' };
    }
    if (selectedOption && passengerCount) {
        query.seatsAvailable = {
          $elemMatch: {
            type: { $regex: selectedOption, $options: 'i' },
            'seatDetail.totalSeats': { $gte: Number(passengerCount) }
          }
        };
      }
    if (destination) {
      query.destination = { $regex: destination, $options: 'i' };
    }
    if (scheduledDate) {
      const date = new Date(scheduledDate);
      query.scheduledDate = { $gte: date.toISOString() };
    }
    const flightData = await flight.find(query).populate({path:'airlineName'});
    if (flightData.length > 0) {
      res.status(200).send(flightData);
    } else {
      res.status(202).send('No Flights found!');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};
const addFlight =async (req,res) =>{
    try {
        // Extract the payload from the request body
        const payload = req.body;
    req.body.airlineName=req.user._id;
        // Create a new flight object using the payload
        const flight = new flightModel(payload);
    
        // Save the flight to the database
        const savedFlight = await flight.save();
    
        res.status(201).json(savedFlight);
      } catch (error) {
        console.error('Error creating flight:', error);
        res.status(500).json({ error: 'Failed to create flight' });
      }
   
}

const deleteFlight =async (req,res) =>{
    try {
        const flightId=req.params.flightId;
        const flightDetail=await flight.findOne({_id:flightId});
        if(!flightDetail ){
            return res.status(400).send('No flight found !')
        }
        else if(flightDetail && flightDetail.airlineName !=req.user._id){
            return res.status(400).send('Unauthorized Access')
        } else{
            const flightData=await flight.deleteOne({_id:flightId});
            if(flightData){
                res.status(200).send(flightData);
            }else{
                res.status(404).send(' No Flights found !')
            }
        }
   
    } catch (error) {
        console.log(error);
        res.status(500).send(error)
        
    }
   
}

const updateFlight =async (req,res) =>{
    try {
        const flightId=req.params.flightId;
    const flightData=await flight.updateOne({_id:flightId},req.body,{new:true,upsert:true});
    if(flightData.modifiedCount>0){
        res.status(200).send(flightData);
    }else{
        res.status(404).send(' No Flights found !')
    }
    } catch (error) {
        res.status(500).send(error)
        
    }
}


module.exports={getFlightDetails,getAllFlightDetails,addFlight,deleteFlight,updateFlight}
