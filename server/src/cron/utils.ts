export const scheduleCronTask = (cron: { schedule: (arg0: string, arg1: () => any) => void; }, method: () => void, unixFormat: string) => {
  return cron.schedule(unixFormat, () => method());
};