import { Router } from "express";
import { getRestaurantByIdController, getRestaurantMenuController, getRestaurantReviewsController, getRestaurantsController } from "./restaurant.controller";

const router = Router();

router.get('/' , getRestaurantsController);
router.get('/:restaurantId' , getRestaurantByIdController);
router.get('/:restaurantId/menu' , getRestaurantMenuController);
router.get('/:restaurantId/reviews' , getRestaurantReviewsController);

export default router;