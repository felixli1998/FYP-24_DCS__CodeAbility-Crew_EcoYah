// Internal imports
import { DonationEvent } from '../src/entities/DonationEvent';
import { DonationEventItem } from '../src/entities/DonationEventItem';
import { DonationRequest } from '../src/entities/DonationRequest';
import { DonationRequestItem } from '../src/entities/DonationRequestItem';
import { User } from '../src/entities/User';

function* DonationRequestGenerator(
  userObjects: { [key: string]: User },
  donationEventObjects: { [key: string]: DonationEvent }
): Generator<{
  donationRequest: DonationRequest;
  donationRequestItems: DonationRequestItem[];
}> {

  const newDonationRequest = new DonationRequest();

  // TODO: omit_points (let's default it to be false for now)
  newDonationRequest.omitPoints = false;

  // TODO: drop_off_date (let's pick a random date within 31 days from today)
  const today = new Date();
  newDonationRequest.dropOffDate = new Date(
    today.getTime() + Math.floor(Math.random() * 31) * 24 * 60 * 60 * 1000
  ); // Random start date within 31 days from today

  // TODO: drop_off_time (let's default it to be 12:00 for now)
  newDonationRequest.dropOffTime = '12:00';

  // TODO: user_id - let's pick a random user
  const randomUser =
    Object.values(userObjects)[
      Math.floor(Math.random() * Object.values(userObjects).length)
    ];

  newDonationRequest.user = randomUser;

  // TODO: donation_event_id - let's pick a random donation event
  const randomDonationEvent =
    Object.values(donationEventObjects)[
      Math.floor(Math.random() * Object.values(donationEventObjects).length)
    ]

  newDonationRequest.donationEvent = randomDonationEvent;

  // TODO: associate this event to a random donation_request_item
  const donationRequestItem = new DonationRequestItem();
  donationRequestItem.quantity = Math.floor(Math.random() * 10);

  const donationEventItems = randomDonationEvent.donationEventItems;

  const randomDonationEventItem = donationEventItems[Math.floor(Math.random() * Object.values(donationEventItems).length)]
  donationRequestItem.donationEventItem = randomDonationEventItem;
  donationRequestItem.quantity = Math.floor(Math.random() * 10);

  // TODO: Create donation_request_item
  yield {
    donationRequest: newDonationRequest,
    donationRequestItems: [donationRequestItem],
  };
}

export default DonationRequestGenerator;
