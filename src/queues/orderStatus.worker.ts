import { Worker } from "bullmq";
import { redisConnection } from "@/config/redis";
import { updateOrderStatusService } from "@/modules/order/order.service";

export const orderStatusWorker = new Worker(
    "orderStatusQueue",
    async (job) => {
        const { orderId, status } = job.data;
        await updateOrderStatusService(orderId, status);
        console.log(`Order ${orderId} status updated to ${status}`);
    },
    { connection: redisConnection }
);