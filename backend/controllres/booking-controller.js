const bookingServices= require('../services/booking');
const User = require('../models/user-model');
const flight= require('../models/flight-model');
const flightModel = require('../models/flight-model');
const { default: mongoose } = require('mongoose');
const bookingModel = require('../models/booking-model');
const { uuid } = require('uuidv4');
const fs=require('fs');
const bookingPdfModel = require('../models/booking-pdf-model');
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

const uploadPdf= async (req, res) => {
    try {
        const { pdfData ,bookingId} = req.body;
    // Generate a unique filename for the PDF
    const filename = `${uuid()}.pdf`;
  
    // Decode the base64 data and write it to a file
    const fileData = Buffer.from(pdfData, 'base64');
    fs.writeFileSync(`uploads/pdfs/${filename}`, fileData);
        const bookingPdf=new bookingPdfModel({bookingId,userId:req.user._id,fileName:filename,filePath:`uploads/pdfs/${filename}`})
    
    const saveBookingPdf=await bookingPdf.save();
     // Return the URL or link to access the PDF
    // const pdfURL = `http://your-backend-hostname/${filename}`;
    if(saveBookingPdf){
        res.status(200).send('File uploaded succesful !');
    }else{
    res.status(405).send('File uploaded unsuccesful !');
    }
    } catch (error) {
        console.log(error);
    res.status(500).send(error);
        
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

const getBookingPdf = async (req,res)=>{
    try {
        const bookingId=req.params.bookingId
        const userId=req?.user._id;
    const bookingData=await bookingPdfModel.findOne({bookingId:bookingId});
    if(bookingData){
        res.status(200).send(bookingData);
    } else if(!bookingData){
        res.status(204).send('No bookings Found !');
    }
} catch (error) {
    console.log(error);
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


module.exports={getBookingDetails,getAllBookings,addBooking,deleteBooking,updateFlight,uploadPdf,getBookingPdf}
