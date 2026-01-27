import { Router } from "express";
import { cancelOrderController, createOrderController, getOrderByIdController, getOrdersController, reorderController } from "./order.controller";

const router = Router();

router.get('/' , getOrdersController);
router.post('/' , createOrderController);
router.get('/:orderId' , getOrderByIdController);
router.post('/:orderId/cancel' , cancelOrderController);
router.post('/:orderId/reorder' , reorderController);

export default router;