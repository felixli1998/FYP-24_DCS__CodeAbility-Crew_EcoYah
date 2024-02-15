// routes/itemRoutes.ts
import express from "express";
import { Item } from "../entities/Item";
import { ItemService } from "../services/ItemService";
import { ItemRepository } from "../repositories/ItemRepository";
import { generateResponse, strongParams } from "../common/methods";
import { EventType } from "../entities/EventType";
import { EventTypeRepository } from "../repositories/EventTypeRepository";

const router = express.Router();
const itemRepository = new ItemRepository();
const eventTypeRepository = new EventTypeRepository();
const itemService = new ItemService(itemRepository);

router.get("/items-by-event-type-name", async (req, res) => {
  try {
    const params = req.query;
    const allowedParams = ["eventTypeName"];
    const filteredParams = strongParams(params, allowedParams);

    const { eventTypeName } = filteredParams;
    if (!eventTypeName || eventTypeName.trim() === "") {
      return generateResponse(res, 404, {
        message: "Event type name parameter is required",
      });
    }
    const items = await itemService.getItemsByEventTypeName(eventTypeName);
    return generateResponse(res, 200, { items });
  } catch (error) {
    console.error(error);
    return generateResponse(res, 500, {
      error: "Failed to retrieve items by event type name",
    });
  }
});

router.post("/create-item", async (req, res) => {
  // Your item-related route logic here
  let EVENT_TYPE_OBJECTS: any = {};
  try {
    const { name, unit, eventTypeName } = req.body;
    if (!name || !unit || !eventTypeName) {
      return generateResponse(res, 400, {
        error: "Missing required parameters",
      });
    }
    const newItem = new Item();
    const eventType =
      await eventTypeRepository.retrieveEventTypeByName(eventTypeName);
    newItem.name = name;
    newItem.unit = unit;
    if (eventType) {
      newItem.eventType = eventType;
    }
    const item = await itemService.createItem(newItem);
    return generateResponse(res, 200, {
      item,
      message: "Item successfully created",
    });
  } catch (error) {
    console.error(error);
    return generateResponse(res, 500, { error: "Failed to create item" });
  }
});

export default router;
