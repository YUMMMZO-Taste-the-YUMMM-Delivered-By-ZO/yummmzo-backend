import { redisConnection } from "@/config/redis";
import { sendEmail } from "@/utils/email.util";
import { Job, Worker } from "bullmq";
import dotenv from 'dotenv';

dotenv.config();

// import "@/queues/email.worker";

// console.log("📨 Email worker started");

export const emailWorker = new Worker('email-queue', async (job: Job) => {
    const { email, name, data } = job.data;
    console.log(`🚀 Processing ${job.name} for: ${email}`);

    switch (job.name) {
        case 'VERIFICATION_EMAIL':
            await sendEmail(email, 'VERIFICATION_EMAIL', {
                name: name || 'User',
                url: `${process.env.FRONTEND_URL}/verify-email?token=${job.data.token}`
            });
            break;

        case 'WELCOME_EMAIL':
            await sendEmail(email, 'WELCOME_EMAIL', { name });
            break;

        case 'PASSWORD_RESET':
            await sendEmail(email, 'PASSWORD_RESET', {
                name,
                resetLink: data?.resetLink
            });
            break;

        case 'PASSWORD_UPDATED':
            await sendEmail(email, 'PASSWORD_UPDATED', { name });
            break;

        case 'PASSWORD_CHANGE_NOTIFICATION':
            await sendEmail(email, 'PASSWORD_CHANGE_NOTIFICATION', { name });
            break;

        case 'ORDER_CONFIRMATION':
            await sendEmail(email, 'ORDER_CONFIRMATION', {
                name,
                orderId: data?.orderId || 'N/A',
                amount: data?.amount || 0
            });
            break;


        default:
            console.warn(`⚠️ Unknown job name: ${job.name}`);
            break;
    }
}, { connection: redisConnection });