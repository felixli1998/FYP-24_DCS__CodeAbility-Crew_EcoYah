// services/ItemService.ts
import { Item } from '../entities/Item';
import { ItemRepository } from '../repositories/ItemRepository';


export class ItemService {
  private itemRepository: ItemRepository;

  constructor(itemRepository: ItemRepository) {
    this.itemRepository = itemRepository;
  }

  async getAllItems() {
    return this.itemRepository.getAllItems(); // Assuming getAllItems is a method in your repository
  }

  async createItem(item: Item) {
    return this.itemRepository.createItem(item); // Assuming createItem is a method in your repository
  }

  // Other business logic methods
}
