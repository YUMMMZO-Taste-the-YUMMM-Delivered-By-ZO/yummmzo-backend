import { Router } from "express";
import { createReviewController, deleteReviewController, getUserReviewsController, updateReviewController } from "./review.controller";

const router = Router();

router.post('/orders/:orderId' , createReviewController);
router.get('/user' , getUserReviewsController);
router.patch('/:reviewId' , updateReviewController);
router.delete('/:reviewId' , deleteReviewController);

export default router;