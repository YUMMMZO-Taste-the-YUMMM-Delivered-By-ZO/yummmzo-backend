import { Router } from "express";
import { cancelOrderController, createOrderController, getOrderByIdController, getOrdersController, reorderController } from "./order.controller";

const router = Router();

router.post('/:userId' , createOrderController);
router.get('/:userId' , getOrdersController);
router.get('/:userId/:orderId' , getOrderByIdController);
router.post('/:userId/:orderId/cancel' , cancelOrderController);
router.post('/:userId/:orderId/reorder' , reorderController);

export default router;