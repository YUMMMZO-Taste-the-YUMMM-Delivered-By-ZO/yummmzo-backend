import { Router } from "express";
import { buildSmartCartController, getCuisinesController, getRestaurantByIdController, getRestaurantMenuController, getRestaurantsController, getTopPicksController } from "./restaurant.controller";
import { authorize } from "@/middlewares/auth.middleware";

const router = Router();

router.get('/', getRestaurantsController);
router.get('/cuisines', getCuisinesController);
router.get('/top-picks', getTopPicksController); 
router.get('/:restaurantId', getRestaurantByIdController);
router.get('/:restaurantId/menu', getRestaurantMenuController);
router.post('/:restaurantId/smart-order', authorize('CUSTOMER') , buildSmartCartController);

export default router;