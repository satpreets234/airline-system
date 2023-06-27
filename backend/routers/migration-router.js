const router=require('express').Router();
const userController=require('../controllres/user-controllers')
const authMiddleware=require('../middleware/auth-middleware')
const migrationController=require('../controllres/migration-controller');
const flightSchemaValidation=require('../middleware/validation/flight-validation');

router.post('/bookingCreatedAt',migrationController.migrationCreatedAtBookingModel);



module.exports = router;
