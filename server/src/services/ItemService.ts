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

  async createItem(item: Item) {
    return this.itemRepository.createItem(item); 
  }
}
