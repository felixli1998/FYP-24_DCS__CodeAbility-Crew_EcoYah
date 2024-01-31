// Internal Imports
import { DonationEvent } from '../entities/DonationEvent';
import { DonationEventRepository } from '../repositories/DonationEventRepository';
import { DonationEventItem } from '../entities/DonationEventItem';
import { DonationEventItemRepository } from '../repositories/DonationEventItemRepository';
import { User } from "../entities/User";
import { UserRepository } from '../repositories/UserRepository';
import { EventType } from "../entities/EventType";
import { EventTypeRepository } from '../repositories/EventTypeRepository';
import { Item } from "../entities/Item";


export class DonationEventService {
  private donationEventRepository: DonationEventRepository;
  private donationEventItemRepository: DonationEventItemRepository;
  private userRepository: UserRepository;
  private eventTypeRepository: EventTypeRepository;

  constructor(donationEventRepository: DonationEventRepository, donationEventItemRepository: DonationEventItemRepository, userRepository: UserRepository, eventTypeRepository: EventTypeRepository) {
    this.donationEventRepository = donationEventRepository;
    this.donationEventItemRepository = donationEventItemRepository;
    this.userRepository = userRepository;
    this.eventTypeRepository = eventTypeRepository;
  }

  async createDonationEvent(donationEvent: DonationEvent) {
    return this.donationEventRepository.createDonationEvent(donationEvent);
  }
}
