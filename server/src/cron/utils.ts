/* Actual CRON method is a lot more robust in terms of allowed values for time - simplifying it */
export const scheduleCronTask = (cron: { schedule: (arg0: string, arg1: () => any) => void; }, method: () => void, scheduleInHrs: number) => {
  return cron.schedule(`* * * * * *`, () => method());
};