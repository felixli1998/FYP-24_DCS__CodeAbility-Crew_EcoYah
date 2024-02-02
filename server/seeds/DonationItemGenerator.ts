import { DonationEvent } from "../src/entities/DonationEvent";
import { DonationEventItem } from "../src/entities/DonationEventItem";
import { Item } from "../src/entities/Item";

function* DonationItemGenerator(
    event: DonationEvent,
    itemObjects: {[key:string]:Item}
): Generator<DonationEventItem>{
    let i = 0;
    while (true) {
        const newItem = new DonationEventItem();
        newItem.targetQty = Math.floor(Math.random() * 100) + 1;
        newItem.minQty = Math.floor(Math.random() * 20) + 1;
        newItem.pointsPerUnit = Math.floor(Math.random() * 100) + 1;
        const randomItem = Object.values(itemObjects)[Math.floor(Math.random() * Object.values(itemObjects).length)];
        newItem.item = randomItem;
        newItem.donationEvent = event;
        yield newItem;
        i++;
    }
}

export default DonationItemGenerator;