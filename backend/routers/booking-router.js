const router=require('express').Router();
const userController=require('../controllres/user-controllers')
const authMiddleware=require('../middleware/auth-middleware')
const bookingController=require('../controllres/booking-controller');
const bookingSchemaValidation=require('../middleware/validation/booking-validation');

router.get('/with-toke/:bookingId',bookingController.getBookingDetails)
router.use(authMiddleware.authenticateUserToken)
router.get('/:bookingId',bookingController.getBookingDetails)
router.get('/',bookingController.getAllBookings);
router.get('/booking-pdf/:bookingId',bookingController.getBookingPdf);
router.post('/upload-pdf',bookingController.uploadPdf);
router.delete('/:bookingId',bookingController.deleteBooking)
router.post('/',bookingController.addBooking)


module.exports = router;