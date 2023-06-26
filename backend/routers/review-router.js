const router=require('express').Router();
const reviewController=require('../controllres/review-controllers')
const authMiddleware=require('../middleware/auth-middleware')
const flightController=require('../controllres/flight-controller');
const flightSchemaValidation=require('../middleware/validation/flight-validation');

router.post('/',authMiddleware.authenticateUserToken,reviewController.addReview);
router.get('/flight/:flightId',authMiddleware.authenticateUserToken,flightController.getFlightDetails);
router.get('/airline-review/:airlineId',authMiddleware.authenticateUserToken,reviewController.getCompanyReviews);
router.delete('/:flightId',authMiddleware.authenticateUserToken,flightController.deleteFlight);
router.put('/:flightId',authMiddleware.authenticateCompanyToken,flightController.addFlight)
router.get('/airline-stars/:airlineId',reviewController.getCompanyTotalStars);



module.exports = router;
