const User = require('../models/user-model');
const flight = require('../models/flight-model');
const flightModel = require('../models/flight-model');
const { default: mongoose } = require('mongoose');
const bookingModel = require('../models/booking-model');


function getRandomDate(start, end) {
    const startDate = new Date(start).getTime();
    const endDate = new Date(end).getTime();
    const randomTime = startDate + Math.random() * (endDate - startDate);
    return new Date(randomTime);
}

const migrationCreatedAtBookingModel = async (req, res) => {
    try {
      const updates = await bookingModel.find({});
      const updatesUpdating = Promise.all(
        updates.map(async (update) => {
          const startDate = '2023-01-01'; // Start date in YYYY-MM-DD format
          const endDate = '2023-06-26'; // End date in YYYY-MM-DD format
  
          const randomDate = getRandomDate(startDate, endDate);
          return await bookingModel.findByIdAndUpdate({_id:update._id}, { $set: { dateCreated: randomDate } });
        })
      );
      await updatesUpdating;
      console.log('Migration completed successfully');
      res.status(200).send('Migration completed successfully');
    } catch (error) {
      console.log(error);
      res.status(500).send(error);
    }
  };

module.exports= {migrationCreatedAtBookingModel}