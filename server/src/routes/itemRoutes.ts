// routes/itemRoutes.ts
import express from 'express';
import { ItemService } from '../services/ItemService';
import { ItemRepository } from '../repositories/ItemRepository';

const router = express.Router();
const itemRepository = new ItemRepository();
const itemService = new ItemService(itemRepository);

router.get('/items', async (req, res) => {
  // Your item-related route logic here
  try {
    const items = await itemService.getAllItems();
    res.json(items);
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
});

router.post('/items', async (req, res) => {
  // Your item-related route logic here
  try {
    const item = await itemService.createItem(req.body);
    res.json(item);
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
});

export default router;
