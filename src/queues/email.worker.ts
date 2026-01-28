import { redisConnection } from "@/config/redis";
import { sendEmail } from "@/utils/email.util";
import { Job, Worker } from "bullmq";

export const emailWorker = new Worker('email-queue', async (job: Job) => {
    const { email, name, data } = job.data;
    console.log(`🚀 Processing ${job.name} for: ${email}`);

    switch (job.name) {
        case 'WELCOME_EMAIL':
            // Sahi signature: (email, type, payload object)
            await sendEmail(email, 'WELCOME_EMAIL', { name });
            break;
            
        case 'ORDER_CONFIRMATION':
            await sendEmail(email, 'ORDER_CONFIRMATION', { 
                name, 
                orderId: data?.orderId || 'N/A',
                amount: data?.amount || 0 
            });
            break;
            
        case 'PASSWORD_RESET':
            await sendEmail(email, 'PASSWORD_RESET', { 
                name, 
                resetLink: data?.resetLink 
            });
            break;
            
        default:
            console.warn(`⚠️ Unknown job name: ${job.name}`);
            break;
    }
}, { connection: redisConnection });