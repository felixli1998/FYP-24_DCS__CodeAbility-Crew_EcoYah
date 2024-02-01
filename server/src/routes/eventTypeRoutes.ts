// routes/itemRoutes.ts
import express from "express";
import {EventTypeService} from "../services/EventTypeService";
import {EventTypeRepository} from "../repositories/EventTypeRepository";
import {strongParams, generateResponse} from "../common/methods";
import {EventType} from "../entities/EventType";

const router = express.Router();
const eventTypeRepository = new EventTypeRepository();
const eventTypeService = new EventTypeService(eventTypeRepository);

router.post("/create-event-type", async (req, res) => {
  try {
    const {eventTypeName} = req.body;
    if (!eventTypeName || eventTypeName.trim() === "") {
      return generateResponse(res, 400, {
        error: "Invalid input: eventTypeName parameter is required",
      });
    }
    const newEventType = new EventType();
    newEventType.name = eventTypeName;
    const eventTypes = await eventTypeService.createEventType(newEventType);
    return generateResponse(res, 200, {
      eventTypes,
      message: "Event type successfully created",
    });
  } catch (error) {
    console.error(error);
    return generateResponse(res, 500, {error: "Failed to create event type"});
  }
});

router.get("/event-types", async (req, res) => {
  try {
    const eventTypes = await eventTypeService.retrieveEventTypes();
    return generateResponse(res, 200, {eventTypes});
  } catch (error) {
    console.error(error);
    return generateResponse(res, 500, {
      error: "Failed to retrieve event types",
    });
  }
});

router.get("/event-type-by-name", async (req, res) => {
  try {
    const params = req.query;
    const allowedParams = ["name"];
    const filteredParams = strongParams(params, allowedParams);

    const {name} = filteredParams;

    if (!name) {
      return generateResponse(res, 404, {
        message: "Name parameter is required",
      });
    }

    const eventType = await eventTypeService.retrieveEventTypeByName(name);
    return generateResponse(res, 200, {eventType});
  } catch (error) {
    console.error(error);
    return generateResponse(res, 500, {
      error: "Failed to retrieve event type by name",
    });
  }
});

export default router;
