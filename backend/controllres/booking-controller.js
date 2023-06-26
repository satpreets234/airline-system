const bookingServices= require('../services/booking');
const User = require('../models/user-model');
const flight= require('../models/flight-model');
const flightModel = require('../models/flight-model');
const { default: mongoose } = require('mongoose');
const bookingModel = require('../models/booking-model');

const getBookingDetails = async (req,res)=>{
    try {
        const bookingId=req.params.bookingId;
        const bookingData=await bookingServices.findBooking(bookingId)
        if(bookingData){
            res.status(200).send(bookingData);
        }else{
            res.status(404).send('Booking not found !')
    } }catch (error) {
        console.log(error);
        res.status(500).send(error)
    }
}

const getAllBookings = async (req,res)=>{
    try {
        const flightId=req.body?.flightId;
        const userId=req?.user._id;
    const bookingData=await bookingServices.getAllBookings(userId,flightId);
    if(bookingData.length>0){
        res.status(200).send(bookingData);
    } else if(bookingData.length==0){
        res.status(204).send('No bookings Found !');
    }
} catch (error) {
        res.status(500).send(error)
        
    }
    
}

const addBooking =async (req,res) =>{
    try {
        // Extract the payload from the request body
        const payload = req.body;
        req.body.userId=req.user._id;
        // Create a new flight object using the payload
        const bookingDetail =await bookingServices.newBooking(req.body)
        // Save the flight to the database
    if(bookingDetail){
        const bookingInfo=await bookingServices.findBooking(bookingDetail._id);
        
        res.status(201).send(bookingDetail);
    }
      } catch (error) {
        console.error('Error creating flight:', error);
        res.status(500).json({ error: 'Failed to create flight' });
      }
   
}

const deleteBooking =async (req,res) =>{
    try {
        const userId=req.user._id;
        const {bookingId}=req.params;
        const flightDetail=await bookingServices.deleteBooking(bookingId,userId)
        if(flightDetail ){
             res.status(200).send('Booking deleted successfully')
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


module.exports={getBookingDetails,getAllBookings,addBooking,deleteBooking,updateFlight}
