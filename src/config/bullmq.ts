import { DefaultJobOptions } from 'bullmq';
import { redisConnection } from './redis';

export const defaultJobOptions: DefaultJobOptions = {
    attempts: 3,
    backoff: {
        type: 'exponential',
        delay: 5000
    },
    removeOnComplete: {
        age: 3600
    },
    removeOnFail: {
        age: (24 * 3600)
    }
};

export const bullConfig = {
    connection: redisConnection
};