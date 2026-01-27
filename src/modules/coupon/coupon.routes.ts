import { Router } from "express";
import { getCouponsController, validateCouponController } from "./coupon.controller";

const router = Router();

router.get('/' , getCouponsController);
router.post('/validate' , validateCouponController);

export default router;