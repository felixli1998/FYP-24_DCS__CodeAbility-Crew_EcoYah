import { Item } from "../entities/Item";
import { AppDataSource } from "../config/data-source";

// Interacts database open close

export class ItemRepository {
    async getAllItems() {
        return await AppDataSource.getRepository(Item).find()
    }

    async getItemsByEventTypeName(eventTypeName: string) {
      return await AppDataSource.getRepository(Item).find({where: { eventType: { name: eventTypeName }}});
    }

    async getItemById(id: number) {
        return await AppDataSource.getRepository(Item).findOne({ where: { id } })
    }
    
    async createItem(item: Item) {
        return await AppDataSource.getRepository(Item).save(item)
    }
//     async updateItem(item: Item) {
//         return await AppDataSource.getRepository(Item).save(item)
//     }
//     async deleteItem(id: number) {
//         return await AppDataSource.getRepository(Item).delete(id)
//     }

    
}