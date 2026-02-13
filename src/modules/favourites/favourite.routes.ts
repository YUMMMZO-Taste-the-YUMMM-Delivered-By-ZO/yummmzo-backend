import { Router } from "express";
import { getFavouritesController, toggleFavouriteController } from "./favourite.controller";
import { authorize } from "@/middlewares/auth.middleware";

const router = Router();

router.get('/', authorize('CUSTOMER') , getFavouritesController);              
router.post('/toggle/:restaurantId', authorize('CUSTOMER') , toggleFavouriteController);  

export default router;