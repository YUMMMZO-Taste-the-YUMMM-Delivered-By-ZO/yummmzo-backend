import { Router } from 'express';
import { forgotPasswordController, loginController, logoutController, registerController, resetPasswordController, verifyEmailController } from './auth.controller';

const router = Router();

router.post('/register' , registerController);
router.post('/login' , loginController);
router.get('/verify-email' , verifyEmailController);
router.post('/forgot-password' , forgotPasswordController);
router.post('/reset-password' , resetPasswordController);
router.post('/logout' , logoutController);

export default router;