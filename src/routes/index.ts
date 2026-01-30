import { Router } from "express";
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/user/user.routes';
import addressRoutes from '../modules/address/address.routes';
import restaurantRoutes from '../modules/restaurant/restaurant.routes';
import cartRoutes from '../modules/cart/cart.routes';
import orderRoutes from '../modules/order/order.routes';
import paymentRoutes from '../modules/payment/payment.routes';
import reviewRoutes from '../modules/review/review.routes';
import couponRoutes from '../modules/coupon/coupon.routes';
import aiRoutes from '../modules/ai/ai.routes';

const router = Router();

router.use('/auth' , authRoutes);
router.use('/user', userRoutes);
router.use('/address' , addressRoutes);
router.use('/restaurant' , restaurantRoutes);
router.use('/cart', cartRoutes);
router.use('/order' , orderRoutes);
router.use('/payment' , paymentRoutes);
router.use('/review' , reviewRoutes);
router.use('/coupon' , couponRoutes);
router.use('/ai' , aiRoutes);

export default router;