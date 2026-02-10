import { Router } from "express";
import { addCartItemController, applyCouponController, clearCartController, getCartController, removeCouponController, updateCartItemController } from "./cart.controller";
import { authorize } from "@/middlewares/auth.middleware";

const router = Router();

router.get('/' , authorize('CUSTOMER') , getCartController);
router.post('/items' , authorize('CUSTOMER') , addCartItemController);
router.patch('/items/:cartItemId' , authorize('CUSTOMER') , updateCartItemController);
router.delete('/' , authorize('CUSTOMER'),  clearCartController);
router.post('/coupon' , authorize('CUSTOMER') , applyCouponController);
router.delete('/coupon' , authorize('CUSTOMER') , removeCouponController);

export default router;