const router=require('express').Router();
const userController=require('../controllres/user-controllers')
const authMiddleware=require('../middleware/auth-middleware');
const upload = require('../services/multer');

router.post('/login', userController.login);
router.post('/signup',userController.signup);
router.get('/profile-data',authMiddleware.authenticateUserToken,userController.profileData);
router.post('/verify',userController.verifyUser);
router.get('/companies',authMiddleware.authenticateUserToken,userController.getAllCompanies)
router.post('/change-password',authMiddleware.authenticateUserToken,userController.changePassword)
router.post('/profile-image',upload.single('profileImage'),authMiddleware.authenticateUserToken,userController.updateProfile)
router.post('/profile-data',upload.single('profileImage'),authMiddleware.authenticateUserToken,userController.updateProfile)
router.post('/reset-password-request',userController.resetPasswordRequest)
router.post('/reset-password',userController.resetPassword)



module.exports = router;
