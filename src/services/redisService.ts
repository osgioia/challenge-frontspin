import { createClient } from 'redis';
import { config } from '../config';

const redis = createClient({
    url: config.redis.url
});

redis.connect().catch(console.error);

export const incrementCounter = async (status: string): Promise<void> => {
    const multi = redis.multi();
    
    multi.incr('total_calls');
    
    if (status === 'success') {
        multi.incr('total_success');
    } else if (status === 'failure') {
        multi.incr('total_failure');
    }
    await multi.exec();
};

export const getStatsFromRedis = async () => {
    const [totalCalls, totalSuccess, totalFailure] = await Promise.all([
        redis.get('total_calls'),
        redis.get('total_success'),
        redis.get('total_failure')
    ]);
    
    return {
        total_calls: parseInt(totalCalls || '0'),
        total_success: parseInt(totalSuccess || '0'),
        total_failure: parseInt(totalFailure || '0')
    };
};

let callCache: Array<{
    path: string;
    startTime: Date;
    finishTime: Date;
    result: string;
}> = [];

export const addToCallCache = async (callData: {
    path: string;
    startTime: Date;
    finishTime: Date;
    result: string;
}) => {
    callCache.push(callData);
    return callCache.length;
};

export const getAndClearCallCache = () => {
    const currentCache = [...callCache];
    callCache = [];
    return currentCache;
};

redis.on('error', (err) => console.error('Redis Client Error', err));