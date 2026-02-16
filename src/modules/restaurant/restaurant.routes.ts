import { Router } from "express";
import { getCuisinesController, getRestaurantByIdController, getRestaurantMenuController, getRestaurantsController, getTopPicksController } from "./restaurant.controller";

const router = Router();

router.get('/', getRestaurantsController);
router.get('/cuisines', getCuisinesController);
router.get('/top-picks', getTopPicksController); 
router.get('/:restaurantId', getRestaurantByIdController);
router.get('/:restaurantId/menu', getRestaurantMenuController);

export default router;