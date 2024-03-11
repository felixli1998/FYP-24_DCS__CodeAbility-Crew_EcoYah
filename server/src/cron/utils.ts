export const scheduleCronTask = (
  cron: typeof import("node-cron"),
  method: () => void,
  unixFormat: string,
) => {
  return (
    cron.schedule(unixFormat, () => method()),
    {
      /* Based on IANA timezone values */
      timezone: "Asia/Singapore",
    }
  );
};
