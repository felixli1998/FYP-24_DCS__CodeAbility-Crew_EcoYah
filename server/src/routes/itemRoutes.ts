// routes/itemRoutes.ts
import express from 'express';
import { Item } from '../entities/Item';
import { ItemService } from '../services/ItemService';
import { ItemRepository } from '../repositories/ItemRepository';
import { generateResponse, strongParams } from '../common/methods';
import { EventType } from '../entities/EventType';
import { EventTypeRepository } from '../repositories/EventTypeRepository';

const router = express.Router();
const itemRepository = new ItemRepository();
const eventTypeRepository = new EventTypeRepository();
const itemService = new ItemService(itemRepository);

router.post('/create', async (req, res) => {
  // Your item-related route logic here
  try {
    const { name, unit, eventTypeId } = req.body;
    if (!name || !unit || !eventTypeId) {
      return generateResponse(res, 400, {
        error: 'Missing required parameters',
      });
    }
    const newItem = new Item();
    const eventType = await eventTypeRepository.retrieveEventTypeById(
      eventTypeId
    );
    newItem.name = name;
    newItem.unit = unit;
    if (eventType) {
      newItem.eventType = eventType;
    }
    const item = await itemService.createItem(newItem);
    return generateResponse(res, 200, {
      item,
      message: 'Item successfully created',
    });
  } catch (error) {
    console.error(error);
    return generateResponse(res, 500, { error: 'Failed to create item' });
  }
});

router.get('/all', async (req, res) => {
  try {
    const items = await itemService.getAllItems();
    return generateResponse(res, 200, { items });
  } catch (error) {
    console.error(error);
    return generateResponse(res, 500, {
      error: 'Failed to retrieve items by event type name',
    });
  }
});

router.get('/:eventId', async (req, res) => {
  try {
    const params = req.query;
    const allowedParams = ['eventTypeId'];
    const filteredParams = strongParams(params, allowedParams);

    const { eventTypeId } = filteredParams;
    if (!eventTypeId) {
      return generateResponse(res, 404, {
        message: 'Event type id parameter is required',
      });
    }
    const items = await itemService.getItemsByEventTypeId(eventTypeId);
    return generateResponse(res, 200, { items });
  } catch (error) {
    console.error(error);
    return generateResponse(res, 500, {
      error: 'Failed to retrieve items by event type name',
    });
  }
});

export default router;
