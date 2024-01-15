import { Item } from "../entities/Item";
import { AppDataSource } from "../config/data-source";

// Interacts database open close

export class ItemRepository {
    async getAllItems() {
        return await AppDataSource.getRepository(Item).find()
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