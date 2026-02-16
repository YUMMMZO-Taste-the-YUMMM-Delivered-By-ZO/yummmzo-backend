import { Router } from "express";
import { cancelOrderController, createOrderController, getOrderByIdController, getOrdersController, reorderController } from "./order.controller";
import { authorize } from "@/middlewares/auth.middleware";

const router = Router();

router.post('/:userId' , authorize('CUSTOMER') , createOrderController);
router.get('/:userId' , authorize('CUSTOMER') , getOrdersController);
router.get('/:userId/:orderId' , authorize('CUSTOMER') , getOrderByIdController);
router.post('/:userId/:orderId/cancel' , authorize('CUSTOMER') , cancelOrderController);
router.post('/:userId/:orderId/reorder' , authorize('CUSTOMER') , reorderController);

export default router;