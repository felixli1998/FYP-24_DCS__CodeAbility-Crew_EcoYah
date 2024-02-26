import { EntitySubscriberInterface, EventSubscriber } from "typeorm"
import { DonationRequest } from "../entities/DonationRequest"

@EventSubscriber()
export class DonationRequestSubscriber implements EntitySubscriberInterface<DonationRequest> {
    /**
     * Indicates that this subscriber only listen to User events.
     */
    listenTo() {
      return DonationRequest
    }

    /**
     * Called before post insertion.
     */
    // afterUpdate(event: UpdateEvent<DonationRequest>): void | Promise<any> {
      // TODO: UPDATE CURRENT QTY OF DONATION EVENT ITEM
    // }
}