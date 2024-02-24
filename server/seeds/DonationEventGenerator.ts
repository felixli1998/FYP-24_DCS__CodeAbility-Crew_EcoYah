import { DonationEvent } from "../src/entities/DonationEvent";
import { EventType } from "../src/entities/EventType";
import { Item } from "../src/entities/Item";
import { User } from "../src/entities/User";
import { ADMIN_SEED_DATA } from "./data";
import { v4 as uuidv4 } from "uuid";

const GENERIC_WORDS = [
  "Community",
  "Unity",
  "Harmony",
  "Hope",
  "Dream",
  "Impact",
  "Inspire",
  "Change",
  "Together",
  "Empower",
];
const CHARITABLE_WORDS = [
  "Giving",
  "Caring",
  "Kindness",
  "Compassion",
  "Support",
  "Love",
  "Humanity",
  "Help",
  "Assist",
  "Serve",
];

function* DonationEventGenerator(
  eventTypesObjects: { [key: string]: EventType },
  userObjects: { [key: string]: User },
  itemObjects: { [key: string]: Item }
): Generator<DonationEvent> {
  let i = 0;
  while (true) {
    const newEvent = new DonationEvent();
    const name1 =
      GENERIC_WORDS[Math.floor(Math.random() * GENERIC_WORDS.length)];
    const name2 =
      CHARITABLE_WORDS[Math.floor(Math.random() * CHARITABLE_WORDS.length)];
    // Event type related
    newEvent.name = `${name1} ${name2}`;
    const randomEvent =
      Object.values(eventTypesObjects)[
        Math.floor(Math.random() * Object.values(eventTypesObjects).length)
      ];
    newEvent.eventType = randomEvent;
    // User related
    const randomUser =
      Object.values(userObjects)[
        Math.floor(Math.random() * Object.values(User).length)
      ];
    newEvent.createdBy = randomUser;
    // Creating event
    newEvent.imageId = uuidv4();
    // Date
    const today = new Date();
    const randomOffset = Math.floor(Math.random() * 4); // Random offset for different start dates

    if (randomOffset === 0) {
      // Event starts 8 days ago
      newEvent.startDate = new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000);
    } else if (randomOffset === 1) {
      // Event starts 4 days ago
      newEvent.startDate = new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000);
    } else if (randomOffset === 2) {
      // Event starts today
      newEvent.startDate = today;
    } else {
      // Event starts 3 days later
      newEvent.startDate = new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000);
    }

    // Ensure the event is 7 days long
    newEvent.endDate = new Date(
      newEvent.startDate.getTime() + 7 * 24 * 60 * 60 * 1000
    );

    newEvent.createdBy = randomUser;
    // Item related
    yield newEvent;
    i++;
  }
}

export default DonationEventGenerator;
