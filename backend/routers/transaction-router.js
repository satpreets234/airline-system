const router=require('express').Router();
const transactionController=require('../controllres/transaction-controller')
const authMiddleware=require('../middleware/auth-middleware')

router.post('/',authMiddleware.authenticateUserToken,transactionController.addTransaction);
// router.get('/flight/:flightId',authMiddleware.authenticateUserToken,flightController.getFlightDetails);
// router.get('/flight-details',authMiddleware.authenticateUserToken,flightController.getAllFlightDetails);
// router.delete('/:flightId',authMiddleware.authenticateUserToken,flightController.deleteFlight);
// router.put('/:flightId',authMiddleware.authenticateCompanyToken,flightController.addFlight)



module.exports = router;
