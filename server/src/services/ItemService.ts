// Internal Imports
import { Item } from '../entities/Item';
import { ItemRepository } from '../repositories/ItemRepository';

export class ItemService {
  private itemRepository: ItemRepository;

  constructor(itemRepository: ItemRepository) {
    this.itemRepository = itemRepository;
  }

  async getAllItems() {
    return this.itemRepository.getAllItems(); 
  }

  async getItemById(id: number) {
    return this.itemRepository.getItemById(id); 
  }

  async getItemsByEventTypeId(eventTypeId: number) {
    return this.itemRepository.getItemsByEventTypeId(eventTypeId); // Assuming getAllItems is a method in your repository
  }

  async createItem(item: Item) {
    return this.itemRepository.createItem(item); 
  }
}
