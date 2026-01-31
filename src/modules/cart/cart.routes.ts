import { Router } from "express";
import { addCartItemController, applyCouponController, clearCartController, getCartController, removeCouponController, updateCartItemController } from "./cart.controller";

const router = Router();

router.get('/:userId' , getCartController);
router.post('/:userId/items' , addCartItemController);
router.patch('/:userId/items/:cartItemId' , updateCartItemController);
router.delete('/:userId' , clearCartController);
router.post('/coupon' , applyCouponController);
router.delete('/coupon' , removeCouponController);

export default router;