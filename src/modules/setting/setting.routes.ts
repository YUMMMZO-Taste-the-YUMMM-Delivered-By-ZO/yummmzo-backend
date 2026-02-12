import { Router } from "express";
import { getUserSettingsController } from "./setting.controller";

const router = Router();

router.get('/orders/:orderId' , getUserSettingsController);

export default router;