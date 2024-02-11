// Internal imports
import { DonationEventItem } from '../src/entities/DonationEventItem';
import { DonationRequest } from '../src/entities/DonationRequest';
import { DonationRequestItem } from '../src/entities/DonationRequestItem';
import { User } from '../src/entities/User';

function* DonationRequestGenerator(
  userObjects: { [key: string]: User },
  donationEventItem: { [key: string]: DonationEventItem }
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

  // TODO: associate this event to a random donation_request_item
  // TODO: For now, let's just create 1 donation_request_items with random quantities for now and associate it to a random donation_event_item
  const donationRequestItem = new DonationRequestItem();
  donationRequestItem.quantity = Math.floor(Math.random() * 10);

  // TODO: For now, let's just associate the first 1 donation_request_items to a random 2 donation_event_items
  // TODO: Slim possibility of having the same donation_event_item for both donation_request_items
  const randomDonationEventItem =
    Object.values(donationEventItem)[
      Math.floor(Math.random() * Object.values(donationEventItem).length)
    ];
  donationRequestItem.donationEventItem = randomDonationEventItem;

  // TODO: Assign a qty to the donation_request_item
  donationRequestItem.quantity = Math.floor(Math.random() * 10);

  // TODO: Create donation_request_item
  yield {
    donationRequest: newDonationRequest,
    donationRequestItems: [donationRequestItem],
  };
}

export default DonationRequestGenerator;
