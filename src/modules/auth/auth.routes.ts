import { Router } from 'express';
import { forgotPasswordController, googleAuthCallbackController, googleAuthController, loginController, logoutController, refreshTokenController, registerController, resetPasswordController, verifyEmailController } from './auth.controller';

const router = Router();

router.post('/register' , registerController);
router.post('/login' , loginController);
router.get('/verify-email' , verifyEmailController);
router.get('/google' , googleAuthController);
router.get('/google/callback' , googleAuthCallbackController);
router.post('/forgot-password' , forgotPasswordController);
router.post('/reset-password' , resetPasswordController);
router.post('/refresh-token' , refreshTokenController);
router.post('/logout' , logoutController);

export default router;