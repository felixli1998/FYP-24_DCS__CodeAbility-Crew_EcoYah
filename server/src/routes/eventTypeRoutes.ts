// routes/itemRoutes.ts
import express from "express";
import {EventTypeService} from "../services/EventTypeService";
import {EventTypeRepository} from "../repositories/EventTypeRepository";
import {strongParams, generateResponse} from "../common/methods";

const router = express.Router();
const eventTypeRepository = new EventTypeRepository();
const eventTypeService = new EventTypeService(eventTypeRepository);

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
    return generateResponse(res, 500, {error: "Internal Server Error"});
  }
});

export default router;
