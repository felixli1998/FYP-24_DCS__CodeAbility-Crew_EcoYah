// Internal Imports
import { EventType } from '../entities/EventType';
import { EventTypeRepository } from '../repositories/EventTypeRepository';

export class EventTypeService {
  private eventTypeRepository: EventTypeRepository;

  constructor(eventTypeRepository: EventTypeRepository) {
    this.eventTypeRepository = eventTypeRepository;
  }

  async createEventType(eventType: EventType) {
    return this.eventTypeRepository.createEventType(eventType);
  }

  async retrieveEventTypes() {
    return this.eventTypeRepository.retrieveEventTypes();
  }

  async retrieveEventTypeById(id: number) {
    return this.eventTypeRepository.retrieveEventTypeById(id);
  }

  async retrieveEventTypeByName(name: string) {
    return this.eventTypeRepository.retrieveEventTypeByName(name);
  }
}
