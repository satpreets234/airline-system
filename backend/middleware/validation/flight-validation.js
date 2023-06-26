const Joi = require('joi');
const seatSchemaValidation = Joi.object({
    className: Joi.string().valid('Business', 'Premium', 'Economy').required(),
    totalSeats: Joi.number().integer().min(0).required(),
    priceDetail: Joi.number().required(),
  });

const flightSchemaValidation = Joi.object({
  flightName: Joi.string().required(),
  airlineName: Joi.string().required(),
  scheduledDate: Joi.date().iso().required(),
  arrivalTime: Joi.date().iso().required(),
  departureTime: Joi.date().iso().required(),
  origin: Joi.string().required(),
  destination: Joi.string().required(),
  seatsAvailable: Joi.array().items(
    Joi.object({
      business: seatSchemaValidation,
    }),
    Joi.object({
      premium: seatSchemaValidation,
    }),
    Joi.object({
      economy: seatSchemaValidation,
    })
  ),
});



const flightValidationMiddleware = (req,res,next) =>{
    const {error} = flightSchemaValidation.validate(req.body);
    if(error){
       return res.sendStatus(400).send(error);
    }
    next();
}
module.exports = flightValidationMiddleware;