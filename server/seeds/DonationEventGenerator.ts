import { DonationEvent } from "../src/entities/DonationEvent";
import { EventType } from "../src/entities/EventType";
import { Item } from "../src/entities/Item";
import { User } from "../src/entities/User";
import { USER_SEED_DATA } from "./data";
import { v4 as uuidv4 } from 'uuid';

const GENERIC_WORDS = ['Community', 'Unity', 'Harmony', 'Hope', 'Dream', 'Impact', 'Inspire', 'Change', 'Together', 'Empower'];
const CHARITABLE_WORDS = ['Giving', 'Caring', 'Kindness', 'Compassion', 'Support', 'Love', 'Humanity', 'Help', 'Assist', 'Serve'];

function* DonationEventGenerator(
    eventTypesObjects:{[key:string]:EventType}, 
    userObjects:{[key:string]:User},
    itemObjects: {[key:string]:Item}
    ): Generator<DonationEvent>{
    let i = 0;
    while (true) {
        const newEvent = new DonationEvent();
        const name1 = GENERIC_WORDS[Math.floor(Math.random() * GENERIC_WORDS.length)];
        const name2 = CHARITABLE_WORDS[Math.floor(Math.random() * CHARITABLE_WORDS.length)];
        // Event type related 
        newEvent.name = `${name1} ${name2}`;
        const randomEvent = Object.values(eventTypesObjects)[Math.floor(Math.random() * Object.values(eventTypesObjects).length)];
        newEvent.eventType = randomEvent;
        // User related
        const randomUser = Object.values(userObjects)[Math.floor(Math.random() * Object.values(User).length)];
        newEvent.createdBy = randomUser;
        // Creating event
        newEvent.imageId = uuidv4();
        // Date
        const today = new Date();
        newEvent.startDate = new Date(today.getTime() + Math.floor(Math.random() * 31) * 24 * 60 * 60 * 1000); // Random start date within 31 days from today
        newEvent.endDate = new Date(newEvent.startDate.getTime() + Math.floor(Math.random() * 15) * 24 * 60 * 60 * 1000); // Random end date within 15 days from start date

        newEvent.createdBy = randomUser;
        // Item related
        yield newEvent;
        i++;
    }
}

export default DonationEventGenerator;