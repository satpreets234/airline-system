const Joi = require('joi');

const seatSchema = Joi.object({
  seatType: Joi.string().valid('Business', 'Premium', 'Economy').required(),
  seatCount: Joi.number().default(1),
});

const bookingSchema = Joi.object({
  userId: Joi.string().required(),
  flightId: Joi.string().required(),
  origin: Joi.string().required(),
  destination: Joi.string().required(),
  seatDetails: seatSchema,
});

const bookingValidationMiddleware = (req,res,next) =>{
    const {error} = bookingSchema.validate(req.body);
    if(error){
       return res.sendStatus(400).send(error);
    }
    next();
}
module.exports = bookingValidationMiddleware;