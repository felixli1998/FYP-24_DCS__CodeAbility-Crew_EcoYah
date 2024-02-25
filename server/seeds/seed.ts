// Internal imports
import { EVENT_TYPE_SEED_DATA, ITEM_SEED_DATA, ADMIN_SEED_DATA, DONATION_EVENT_SEED_DATA } from './data';
// Users
import { User } from '../src/entities/User';
import { UserRepository } from '../src/repositories/UserRepository';
import { UserService } from '../src/services/UserService';
import { hashSync } from "bcrypt";

// Event Types
import { EventTypeRepository } from '../src/repositories/EventTypeRepository';
import { EventTypeService } from '../src/services/EventTypeService';
import { EventType } from '../src/entities/EventType';
// Donation Events
import { DonationEventRepository } from '../src/repositories/DonationEventRepository';
import { DonationEventService } from '../src/services/DonationEventService';
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
import DonationRequestGenerator from './DonationRequestGenerator';
import { DonationRequestItemRepository } from '../src/repositories/DonationRequestItemRepository';
import { DonationRequestItemService } from '../src/services/DonationRequestItemService';
import { DonationRequestRepository } from '../src/repositories/DonationRequestRepository';
import { DonationRequestService } from '../src/services/DonationRequestService';
import { DonationEvent } from '../src/entities/DonationEvent';
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
const donationEventItemService = new DonationEventItemService(
  donationEventItemRepository
);

// Donation Events
const donationEventRepository = new DonationEventRepository();
const donationEventService = new DonationEventService(donationEventRepository);

// Donation Request
const donationRequestRepository = new DonationRequestRepository();
const donationRequestService = new DonationRequestService(
  donationRequestRepository
);

// Donation Request Items
const donationRequestItemRepository = new DonationRequestItemRepository();
const donationRequestItemService = new DonationRequestItemService(
  donationRequestItemRepository
);

let USER_OBJECTS: any = {};
let ADMIN_OBJECTS: any = {};
let EVENT_TYPE_OBJECTS: any = {};
let DONATION_EVENT_OBJECTS: any = {};
let ITEM_OBJECTS: any = {};

const NO_OF_USER_TO_CREATE = 5;
const NO_OF_DONATION_REQUEST_TO_CREATE = 5;

// Donor seed data - keep this //
const generateSeedData = async () => {
  // Create users seed data //
  console.log('=== Generating users seed data ... ===');
  const userGenerator = UserGenerator();
  for (let i = 0; i < NO_OF_USER_TO_CREATE; i++) {
    const user = userGenerator.next().value;
    console.log('Generated user number ' + i + ': ' + user.name);
    const createdUser = await userService.createUser(user);

    USER_OBJECTS[user.name] = createdUser;
  }

  // Admin seed data - Keep this //
  console.log("=== Generating user admins seed data ... ===");
  for(const eachAdmin of ADMIN_SEED_DATA){
    const newAdmin = new User();
    newAdmin.name = eachAdmin.name;
    newAdmin.email = eachAdmin.email;
    newAdmin.passwordDigest = hashSync(eachAdmin.passwordInput, 10);
    newAdmin.contactNum = eachAdmin.contactNum;
    newAdmin.imageId = eachAdmin.imageURL;
    newAdmin.role = eachAdmin.role;

    const createdAdminUser = await userService.createUser(newAdmin);

    ADMIN_OBJECTS[eachAdmin.name] = createdAdminUser;
  }

  // Event Type seed data //
  console.log('=== Generating event type seed data ... ===');
  await Promise.all(
    EVENT_TYPE_SEED_DATA.map(async (eventType) => {
      const newEventType = new EventType();
      newEventType.name = eventType.name;
      const createdEventType = await eventTypeService.createEventType(
        newEventType
      );

      EVENT_TYPE_OBJECTS[eventType.name] = createdEventType;
    })
  );

  // Item seed data //
  console.log('=== Generating item seed data ... ===');
  await Promise.all(
    ITEM_SEED_DATA.map(async (item) => {
      const newItem = new Item();
      newItem.name = item.name;
      newItem.unit = item.unit;
      newItem.eventType = EVENT_TYPE_OBJECTS[item.eventType];

      const createdItem = await itemService.createItem(newItem);
      ITEM_OBJECTS[item.name] = createdItem;
    })
  );

  console.log('=== Generating Donation Event seed data ... ===');
  await Promise.all(
    DONATION_EVENT_SEED_DATA.map(async (donationEvent) => {
      const newDonationEvent = new DonationEvent();

      newDonationEvent.name = donationEvent.name;
      newDonationEvent.createdBy = ADMIN_OBJECTS[donationEvent.user];
      newDonationEvent.eventType = EVENT_TYPE_OBJECTS[donationEvent.eventType];
      newDonationEvent.imageId = donationEvent.imageId;
      newDonationEvent.startDate = donationEvent.startDate;
      newDonationEvent.endDate = donationEvent.endDate;

      // Create donation event items
      const donationEventItems = donationEvent.donationEventItems.map((donationEventItem) => {
        const newDonationEventItem = new DonationEventItem();
        newDonationEventItem.item = ITEM_OBJECTS[donationEventItem.name];
        newDonationEventItem.minQty = donationEventItem.minQty;
        newDonationEventItem.targetQty = donationEventItem.targetQty;
        newDonationEventItem.pointsPerUnit = donationEventItem.pointsPerUnit;

        return newDonationEventItem;
      });

      newDonationEvent.donationEventItems = donationEventItems;

      const createdDonationEvent = await donationEventService.createDonationEvent(newDonationEvent);

      const createdDonationEventItem = createdDonationEvent.donationEventItems;


      DONATION_EVENT_OBJECTS[donationEvent.name] = createdDonationEvent;
    })
  );

  console.log('=== Generating Donation Request seed data ... ===');
  for (let i = 0; i < NO_OF_DONATION_REQUEST_TO_CREATE; i++) {
    const generatorResult = DonationRequestGenerator(
      USER_OBJECTS,
      DONATION_EVENT_OBJECTS,
    );
    const { donationRequest, donationRequestItems } =
      generatorResult.next().value;

    await Promise.all([
      donationRequestItemService.createDonationRequestItem(
        donationRequestItems[0]
      ),
    ]);

    donationRequest.donationRequestItems = donationRequestItems;
    await donationRequestService.createDonationRequest(donationRequest);

    console.log('Donation Request created: ' + donationRequest);
  }
  console.log('=== Generating of seed data completed ===');
};

export default generateSeedData;
