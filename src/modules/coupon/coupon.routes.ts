import { Router } from "express";
import { getCouponsController, validateCouponController } from "./coupon.controller";
import { authorize } from "@/middlewares/auth.middleware";

const router = Router();

router.get('/' , authorize('CUSTOMER') , getCouponsController);
router.post('/validate' , authorize('CUSTOMER') , validateCouponController);

export default router;