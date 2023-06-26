const router=require('express').Router();
const userController=require('../controllres/user-controllers')
const authMiddleware=require('../middleware/auth-middleware')
const flightController=require('../controllres/flight-controller');
const flightSchemaValidation=require('../middleware/validation/flight-validation');

router.post('/',authMiddleware.authenticateCompanyToken,flightController.addFlight);
router.get('/flight/:flightId',authMiddleware.authenticateUserToken,flightController.getFlightDetails);
router.get('/flight-details',authMiddleware.authenticateUserToken,flightController.getAllFlightDetails);
router.delete('/:flightId',authMiddleware.authenticateUserToken,flightController.deleteFlight);
router.put('/:flightId',authMiddleware.authenticateCompanyToken,flightController.addFlight)



module.exports = router;
