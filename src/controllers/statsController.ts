import { Request, Response } from 'express';
import { incrementCounter, getStatsFromRedis, addToCallCache, getAndClearCallCache } from '../services/redisService';
import { batchInsertCalls } from '../services/pgService';

export const createStatus = async (req: Request<{ status: string }>, res: Response) => {
  const startTime = new Date();
  const { status } = req.params;
  
  if (status !== 'success' && status !== 'failure') {
    return res.status(400).json({ error: 'Status must be either "success" or "failure"' });
  }

  try {
    await incrementCounter(status);
    
    const finishTime = new Date();
    const cacheSize = await addToCallCache({
      path: `/create/${status}`,
      startTime,
      finishTime,
      result: status
    });


    if (cacheSize >= 5) {
      const callsToFlush = getAndClearCallCache();
      batchInsertCalls(callsToFlush).catch(console.error);
    }

    return res.status(200).json({ message: `Call recorded as ${status}` });
  } catch (err) {
    console.error('Error processing request:', err);
    return res.status(500).json({ error: 'Error processing request' });
  }
};

export const getStats = async (_req: Request, res: Response) => {
  try {
    const stats = await getStatsFromRedis();
    return res.json(stats);
  } catch (err) {
    console.error('Error fetching stats:', err);
    return res.status(500).json({ error: 'Error fetching stats' });
  }
};