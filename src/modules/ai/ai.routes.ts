import { Router } from "express";
import { getDeliveryTimeController, getSuggestionsController, searchDiscoveryController } from "./ai.controller";

const router = Router();

router.get('/suggestions' , getSuggestionsController);
router.post('/search' , searchDiscoveryController);
router.get('/delivery-time' , getDeliveryTimeController);

export default router;