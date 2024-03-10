/* Feel free to import your service methods here */

const testMethod = () => {
  console.log(`This is a cron job that runs every second!: ${new Date()}`);
}

export const scheduledMethods = [
  { method: testMethod, unixFormat: "*/15 * * * * *", description: "This is simple log method that runs every 15 seconds" }
]