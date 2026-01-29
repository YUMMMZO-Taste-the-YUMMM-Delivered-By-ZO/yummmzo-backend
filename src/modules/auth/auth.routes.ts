import { Router } from 'express';
import { forgotPasswordController, loginController, logoutController, registerController, resetPasswordController, verifyEmailController } from './auth.controller';

const router = Router();

router.post('/register' , registerController);
router.get('/verify-email' , verifyEmailController);
router.post('/login' , loginController);
router.post('/logout' , logoutController);
router.post('/forgot-password' , forgotPasswordController);
router.post('/reset-password' , resetPasswordController);

export default router;