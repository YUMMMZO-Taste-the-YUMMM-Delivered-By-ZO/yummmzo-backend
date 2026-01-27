import { catchAsync } from "@/utils/catchAsync.util";
import { Request, Response, NextFunction } from "express";

/**
    * API 7.1: Add Review
    * POST /api/v1/orders/:orderId/review
*/
export const createReviewController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Validation: Validate rating (1-5, 0.5 steps) and review text (min 10 chars) via Zod.
    // 2. Order Check: Verify order exists, belongs to user, and status is strictly 'DELIVERED'.
    // 3. Duplicate Check: Check if a review already exists for this `orderId` (Return 400).
    // 4. DB Transaction (Prisma):
    //    - Create Review record with optional images.
    //    - Link to restaurantId and userId.
    // 5. Post-Review Logic: 
    //    - Queue Job: Add 'RECALCULATE_RESTAURANT_RATING' to BullMQ to update average score.
    // 6. Cache Invalidation: Delete `restaurant:reviews:{restaurantId}:*` and `restaurant:details:{id}` from Redis.
    // 7. Response: Return 201 success.
});

/**
    * API: Get User Reviews
    * GET /api/v1/users/reviews
*/
export const getUserReviewsController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Extract userId.
    // 2. Query Prisma: Fetch all reviews by user including Restaurant info and Order metadata.
    // 3. Sorting: Default to `createdAt: desc`.
    // 4. Response: Return 200 with user's feedback history.
});

/**
    * API: Update Review
    * PATCH /api/v1/reviews/:reviewId
*/
export const updateReviewController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Ownership Check: Verify reviewId belongs to current userId.
    // 2. Validation: Allow partial updates for rating/review text.
    // 3. Time Constraint: (Optional) Only allow updates within 48 hours of posting.
    // 4. DB Update: Update the Review record.
    // 5. Cache Invalidation: Clear restaurant review and details cache in Redis.
    // 6. Queue: Trigger rating recalculation for the restaurant.
    // 7. Response: Return 200 success.
});

/**
    * API: Delete Review
    * DELETE /api/v1/reviews/:reviewId
*/
export const deleteReviewController = catchAsync(async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // 1. Ownership Check: Ensure user owns the review.
    // 2. DB Delete: Remove the review record.
    // 3. Cache Invalidation: Clear related Redis keys.
    // 4. Rating Sync: Trigger BullMQ job to recalculate the restaurant's `rating` and `totalRatings`.
    // 5. Response: Return 200 success.
});