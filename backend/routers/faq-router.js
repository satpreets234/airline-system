const router=require('express').Router();
const faqController=require('../controllres/faq-controller')
const authMiddleware=require('../middleware/auth-middleware')
const faqSchemaValidation=require('../middleware/validation/faq-validation');

router.put('/:faqId',authMiddleware.authenticateAdminToken,faqController.updateFaq)
router.get('/',faqController.getFaqs);
router.delete('/:faqId',authMiddleware.authenticateAdminToken,faqController.deleteFaq)
router.post('/:faqParentId',authMiddleware.authenticateAdminToken,faqSchemaValidation,faqController.addFaq)


module.exports = router;