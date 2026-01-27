import { Router } from "express";
import { createPaymentOrderController, getPaymentStatusController, verifyPaymentController } from "./payment.controller";

const router = Router();

router.post('/verify' , verifyPaymentController);
router.post('/create-order' , createPaymentOrderController);
router.get('/:orderId/status' , getPaymentStatusController);

export default router;