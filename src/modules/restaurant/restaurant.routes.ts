import { Router } from "express";
import { getCuisinesController, getRestaurantByIdController, getRestaurantMenuController, getRestaurantReviewsController, getRestaurantsController, getTopPicksController } from "./restaurant.controller";

const router = Router();

router.get('/', getRestaurantsController);
router.get('/cuisines', getCuisinesController);
router.get('/top-picks', getTopPicksController); 
router.get('/:restaurantId', getRestaurantByIdController);
router.get('/:restaurantId/menu', getRestaurantMenuController);
router.get('/:restaurantId/reviews', getRestaurantReviewsController);

export default router;