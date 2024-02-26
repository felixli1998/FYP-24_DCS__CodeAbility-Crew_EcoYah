import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from "typeorm";
import { User, UserRole } from "../entities/User";
import { UserPoints } from "../entities/UserPoints";

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  /**
   * Indicates that this subscriber only listen to User events.
   */
  listenTo() {
    return User;
  }

  /**
   * Called before post insertion.
   */
  afterInsert(event: InsertEvent<User>) {
    // Create User Points
    if (event.entity.role === UserRole.DONOR) {
      const userPointsObj = new UserPoints();
      userPointsObj.user = event.entity;

      // Save the User Points
      event.manager.save(userPointsObj);
    }
  }
}
