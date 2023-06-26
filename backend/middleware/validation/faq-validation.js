const Joi = require('joi');

const faqSchemaValidation = Joi.object({
  question:Joi.string().required(),
  answer:Joi.string().required()
});



const faqValidationMiddleware = (req,res,next) =>{
    const {error} = faqSchemaValidation.validate(req.body);
    if(error){
       return res.sendStatus(400).send(error);
    }
    next();
}
module.exports = faqValidationMiddleware;