import { Router } from "express";
import authRoutes from '../modules/auth/auth.routes';
import userRoutes from '../modules/user/user.routes';
import addressRoutes from '../modules/address/address.routes';
import restaurantRoutes from '../modules/restaurant/restaurant.routes';
import favouriteRoutes from '../modules/favourites/favourite.routes';
import cartRoutes from '../modules/cart/cart.routes';
import orderRoutes from '../modules/order/order.routes';
import couponRoutes from '../modules/coupon/coupon.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);
router.use('/address', addressRoutes);
router.use('/restaurant', restaurantRoutes);
router.use('/favourites' , favouriteRoutes);
router.use('/cart', cartRoutes);
router.use('/coupon', couponRoutes);
router.use('/order' , orderRoutes);

export default router;