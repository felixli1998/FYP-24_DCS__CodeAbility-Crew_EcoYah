import { DonationEvent } from "../src/entities/DonationEvent";
import { EventType } from "../src/entities/EventType";
import { Item } from "../src/entities/Item";
import { User } from "../src/entities/User";
import { ADMIN_SEED_DATA } from "./data";
import { v4 as uuidv4 } from 'uuid';

const GENERIC_WORDS = ['Community', 'Unity', 'Harmony', 'Hope', 'Dream', 'Impact', 'Inspire', 'Change', 'Together', 'Empower'];
const CHARITABLE_WORDS = ['Giving', 'Caring', 'Kindness', 'Compassion', 'Support', 'Love', 'Humanity', 'Help', 'Assist', 'Serve'];
const DEFAULT_IMAGES = ["ElectronicsPoster.jpg", "FoodProducePoster.jpg", "BookPoster.jpeg", "ClothesPoster.jpeg"];
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
        newEvent.imageId = DEFAULT_IMAGES[i % DEFAULT_IMAGES.length];
        // Date
        const today = new Date();
        const randomOffset = Math.floor(Math.random() * 3); // Random number between 0 and 2
        
        let startOffset = 0;
        if (randomOffset === 0) {
            startOffset = -5; // 5 days ago
        } else if (randomOffset === 1) {
            startOffset = -2; // 2 days ago
        } else {
            startOffset = 3; // 3 days later
        }
        
        const startDate = new Date(today.getTime() + startOffset * 24 * 60 * 60 * 1000); // Start date
        
        const endDate = new Date(startDate.getTime() + 4 * 24 * 60 * 60 * 1000); // End date is 4 days after the start date
        
        newEvent.startDate = startDate;
        newEvent.endDate = endDate;
        newEvent.createdBy = randomUser;
        // Item related
        yield newEvent;
        i++;
    }
}

export default DonationEventGenerator;