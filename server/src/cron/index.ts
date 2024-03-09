/* Feel free to import your service methods here */

const testMethod = () => {
  console.log(`This is a cron job that runs every second!: ${new Date()}`);
}

export const scheduledMethods = [
  { method: testMethod, scheduleInHrs: 0.01, description: "This is simply a test method to illustrate the CRON" }
]