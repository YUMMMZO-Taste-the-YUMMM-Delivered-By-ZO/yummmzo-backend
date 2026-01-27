import { Router } from "express";
import { addCartItemController, applyCouponController, clearCartController, getCartController, removeCartItemController, removeCouponController, updateCartItemController } from "./cart.controller";

const router = Router();

router.get('/' , getCartController);
router.post('/items' , addCartItemController);
router.patch('/items/:cartItemId' , updateCartItemController);
router.delete('/items/:cartItemId' , removeCartItemController);
router.delete('/' , clearCartController);
router.post('/coupon' , applyCouponController);
router.delete('/coupon' , removeCouponController);

export default router;