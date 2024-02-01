// External imports
import { hashSync } from 'bcrypt';
// Internal imports
import { USER_SEED_DATA, EVENT_TYPE_SEED_DATA, ITEM_SEED_DATA, DONATION_EVENT_SEED_DATA } from './data';
// Users
import { User } from '../src/entities/User';
import { UserRepository } from '../src/repositories/UserRepository';
import { UserService } from '../src/services/UserService';
// Event Types
import { EventTypeRepository } from '../src/repositories/EventTypeRepository';
import { EventTypeService } from '../src/services/EventTypeService';
import { EventType } from '../src/entities/EventType';
// Donation Events
import { DonationEventRepository } from '../src/repositories/DonationEventRepository';
import { DonationEventService } from '../src/services/DonationEventService';
import { DonationEvent } from '../src/entities/DonationEvent';
// Items
import { ItemRepository } from '../src/repositories/ItemRepository';
import { ItemService } from '../src/services/ItemService';
import { Item } from '../src/entities/Item';
// Donation Event Items
import { DonationEventItemRepository } from '../src/repositories/DonationEventItemRepository';
import { DonationEventItemService } from '../src/services/DonationEventItemService';

import UserGenerator from './UserGenerator';
import DonationEventGenerator from './DonationEventGenerator';
import DonationItemGenerator from './DonationItemGenerator';
// TODO: Want to refactor this to use a singleton pattern instead of constantly creating new instances of the services //
// Users
const userRepository = new UserRepository();
const userService = new UserService(userRepository);

// Event Types
const eventTypeRepository = new EventTypeRepository();
const eventTypeService = new EventTypeService(eventTypeRepository);

// Donation Events
const donationEventRepository = new DonationEventRepository();
const donationEventService = new DonationEventService(donationEventRepository);

// Items
const itemRepository = new ItemRepository();
const itemService = new ItemService(itemRepository);

// Donation Event Items
const donationEventItemRepository = new DonationEventItemRepository();
const donationEventItemService = new DonationEventItemService(donationEventItemRepository);

let USER_OBJECTS: any = {};
let EVENT_TYPE_OBJECTS: any = {};
let ITEM_OBJECTS: any = {};

const NO_OF_USER_TO_CREATE = 50;
const NO_OF_DONATION_EVENT_TO_CREATE = 50;
const NO_OF_ITEM_PER_EVENT = 5;

// TODO: Feel free to populate more into the seed data as we add more tables //
const generateSeedData = async () => {
  console.log("=== Generating seed data ===")

  // Create users seed data //
  console.log("=== Generating users seed data ... ===")
  const userGenerator = UserGenerator();
  for (let i = 0; i < NO_OF_USER_TO_CREATE; i ++){
    const user = userGenerator.next().value;
    console.log("Generated user number " + i + ": " + user.name);
    await userService.createUser(user)
  }

  console.log("=== Generating event type seed data ... ===")
  await Promise.all(EVENT_TYPE_SEED_DATA.map(async (eventType) => {
    const newEventType = new EventType();
    newEventType.name = eventType.name;
    const createdEventType = await eventTypeService.createEventType(newEventType);

    EVENT_TYPE_OBJECTS[eventType.name] = createdEventType;
  }));

  console.log("=== Generating item seed data ... ===")
  await Promise.all(ITEM_SEED_DATA.map(async (item) => {
    const newItem = new Item();
    newItem.name = item.name;
    newItem.unit = item.unit;
    newItem.eventType = EVENT_TYPE_OBJECTS[item.eventType];

    const createdItem = await itemService.createItem(newItem);
    ITEM_OBJECTS[item.name] = createdItem;
  }));

  const eventGenerator = DonationEventGenerator(EVENT_TYPE_OBJECTS, USER_OBJECTS, ITEM_OBJECTS);
  for (let i = 0; i < NO_OF_DONATION_EVENT_TO_CREATE; i ++){
    const event = eventGenerator.next().value;
    await donationEventService.createDonationEvent(event);
    // Adding in items
    const donationItemGenerator = DonationItemGenerator(event, ITEM_OBJECTS);
    for (let j = 0; j < NO_OF_ITEM_PER_EVENT; j++) {
      const donationItem = donationItemGenerator.next().value;
      console.log("DoonationItem is " + donationItem)
      await donationEventItemService.createDonationEventItem(donationItem);

    }
    // Adding in event objects
}
  console.log("=== Generating of seed data completed ===")
}

export default generateSeedData;