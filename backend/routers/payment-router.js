const router=require('express').Router();
const paymentController=require('../controllres/payment-controller')
const authMiddleware=require('../middleware/auth-middleware')

router.post('/verify', paymentController.completePayment);
// router.post('/signup',userController.signup);

module.exports= router