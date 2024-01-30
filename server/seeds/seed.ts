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
import { DonationEventItem } from '../src/entities/DonationEventItem';

// TODO: Want to refactor this to use a singleton pattern instead of constantly creating new instances of the services //
// Users
const userRepository = new UserRepository();
const userService = new UserService(userRepository);

// Event Types
const eventTypeRepository = new EventTypeRepository();
const eventTypeService = new EventTypeService(eventTypeRepository);

// Items
const itemRepository = new ItemRepository();
const itemService = new ItemService(itemRepository);

// Donation Event Items
const donationEventItemRepository = new DonationEventItemRepository();
const donationEventItemService = new DonationEventItemService(donationEventItemRepository);

// Donation Events
const donationEventRepository = new DonationEventRepository();
const donationEventService = new DonationEventService(donationEventRepository, donationEventItemRepository, userRepository, eventTypeRepository);

let USER_OBJECTS: any = {};
let EVENT_TYPE_OBJECTS: any = {};
let ITEM_OBJECTS: any = {};
let DONATION_EVENT_OBJECTS: any = {};

// TODO: Feel free to populate more into the seed data as we add more tables //
const generateSeedData = async () => {
  console.log("=== Generating seed data ===")

  // Create users seed data //
  console.log("=== Generating users seed data ... ===")
  await Promise.all(USER_SEED_DATA.map(async (user) => {
    const newUser = new User();
    const passwordDigest = hashSync(user.passwordInput, 10); // 10 is the salt rounds

    newUser.name = user.name;
    newUser.email = user.email;
    newUser.passwordDigest = passwordDigest;
    newUser.contactNum = user.contactNum;
    newUser.imageId = user.imageURL;
    newUser.role = user.role;
    const createdUser = await userService.createUser(newUser);

    USER_OBJECTS[user.name] = createdUser;
  }));

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

  console.log("=== Generating donation event and donation event items seed data ... ===")
  await Promise.all(DONATION_EVENT_SEED_DATA.map(async (donationEvent) => {
    const newDonationEvent = new DonationEvent();
    newDonationEvent.name = donationEvent.name;
    newDonationEvent.imageId = donationEvent.imageId;
    newDonationEvent.startDate = donationEvent.startDate;
    newDonationEvent.endDate = donationEvent.endDate;
    newDonationEvent.eventType = EVENT_TYPE_OBJECTS[donationEvent.eventType];
    newDonationEvent.createdBy = USER_OBJECTS[donationEvent.user];
    console.log(USER_OBJECTS[donationEvent.user])
    const createdDonationEvent = await donationEventService.createDonationEvent(newDonationEvent);
    DONATION_EVENT_OBJECTS[donationEvent.name] = createdDonationEvent;

    await Promise.all(donationEvent.donationEventItems.map(async (donationEventItem: any) => {
      const newDonationEventItem = new DonationEventItem();
      newDonationEventItem.targetQty = donationEventItem.targetQty;
      newDonationEventItem.minQty = donationEventItem.minQty;
      newDonationEventItem.pointsPerUnit = donationEventItem.pointsPerUnit;
      newDonationEventItem.donationEvent = createdDonationEvent;
      newDonationEventItem.item = ITEM_OBJECTS[donationEventItem.name]; // Associate the item to the donation event item
      newDonationEventItem.donationEvent = createdDonationEvent;

      await donationEventItemService.createDonationEventItem(newDonationEventItem);
    }));
  }));

  console.log("=== Generating of seed data completed ===")
}

export default generateSeedData;