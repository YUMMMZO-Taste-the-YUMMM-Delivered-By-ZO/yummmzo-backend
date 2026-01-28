import { Queue } from 'bullmq';
import { bullConfig , defaultJobOptions } from '../config/bullmq';

export function createQueue(name: string) {
    return new Queue(name , {
        ...bullConfig,
        defaultJobOptions
    });
};