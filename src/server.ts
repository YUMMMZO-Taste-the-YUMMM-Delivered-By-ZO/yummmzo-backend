import dotenv from 'dotenv';
dotenv.config();

import app from "./app";

import "@/queues/email.worker";
console.log("📨 Email worker started");
import "@/queues/orderStatus.worker";
console.log("📨 Order Status worker started");

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`🔥 Yummmzo Backend is running on port ${port}`);
    console.log(`🚀 Redis & BullMQ Worker is listening for jobs...`);
});