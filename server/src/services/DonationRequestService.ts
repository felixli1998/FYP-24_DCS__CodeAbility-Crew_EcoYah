import { DonationRequest } from '../entities/DonationRequest';
import { DonationRequestItem } from '../entities/DonationRequestItem';
import { DonationRequestRepository } from '../repositories/DonationRequestRepository';

// Import other services
import { DonationEventService } from './DonationEventService';
import { DonationEventRepository } from '../repositories/DonationEventRepository';
export class DonationRequestService {
  private donationRequestRepository: DonationRequestRepository;

  constructor(donationRequestRepository: DonationRequestRepository) {
    this.donationRequestRepository = donationRequestRepository;
  }

  async getActiveDonationRequestFromUser(user_id:number, page: number = 1) {
    return await this.donationRequestRepository.getActiveDonationRequestFromUser(
      user_id,
      page
    );
  }

  async getCompletedDonationRequestFromUser(user_id:number, page: number = 1) {
    return await this.donationRequestRepository.getCompletedDonationRequestFromUser(
      user_id,
      page
    );
  }

  async createDonationRequest(donationRequest: DonationRequest) {
  // Not implemented yet
  //   // Business logic checks here
  //   // Ensure that at least one item has been selected, and quantity is at least one 
  //   // Ensure that the drop off date is within the start and end date of the donation event
  //   if (this.validateDonationRequestItems(donationRequest.donationRequestItems)){
      
  //   }
  //   const dropOffDate = donationRequest.dropOffDate;
  //   const dropOffTime = donationRequest.dropOffTime;
  //   // Retrieve donation event 
  //   const donationEventRepository= new DonationEventRepository();
  //   const donationEventService = new DonationEventService(donationEventRepository);

  //  const _ = await donationEventService.getDonationEventById(1);
  //  console.log("This is event details", _)
   
  //   console.log("Service logic here");
  //   console.log(donationRequest)
  //   return await this.donationRequestRepository.createDonationRequest(
  //     donationRequest
  //   );
  }

  async cancelDonationRequest(id: number) {
    return await this.donationRequestRepository.cancelDonationRequest(id);
  }

  async retrieveDonationRequestByDate(date: Date) {
    return await this.donationRequestRepository.retrieveDonationRequestByDate(
      date
    );
  }

  // Helper functions below
  validateDonationRequestItems(donationRequestItem: DonationRequestItem[]): {valid: boolean, message: string} {
    // Check not empty
    if (donationRequestItem.length === 0) {
      return {
        valid: false,
        message: "Donation request items cannot be empty"
      };
    }
    // Check quantity
    for (let item of donationRequestItem) {
      if (item.quantity < 1) {
        return {
          valid: false,
          message: "Quantity must be at least 1"
        };
      }
    } 
    return {
      valid: true,
      message: "Donation request items are valid"
    };
  }
}
