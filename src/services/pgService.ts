import { DataSource } from 'typeorm';
import { CallLog } from '../entities/CallLog';
import { config } from '../config';

export const AppDataSource = new DataSource({
  ...config.database,
  entities: [CallLog]
});

export const initializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log("Data Source has been initialized!");
  } catch (error) {
    console.error("Error during Data Source initialization:", error);
    throw error;
  }
};

export const batchInsertCalls = async (calls: Array<{
  path: string;
  startTime: Date;
  finishTime: Date;
  result: string;
}>): Promise<void> => {
  try {
    const callLogRepository = AppDataSource.getRepository(CallLog);
    
    const callLogs = calls.map(call => {
      const callLog = new CallLog();
      callLog.path = call.path;
      callLog.startTime = call.startTime;
      callLog.finishTime = call.finishTime;
      callLog.result = call.result;
      return callLog;
    });

    await callLogRepository.save(callLogs);
  } catch (error) {
    console.error("Error during batch insert:", error);
    throw error;
  }
};

export const getCallLogs = async (): Promise<CallLog[]> => {
  const callLogRepository = AppDataSource.getRepository(CallLog);
  return await callLogRepository.find();
};