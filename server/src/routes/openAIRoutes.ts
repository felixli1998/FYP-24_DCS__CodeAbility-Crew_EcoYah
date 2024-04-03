import express from "express";
import { generateResponse, strongParams } from "../common/methods";
import { DonationEventRepository } from "../repositories/DonationEventRepository";
import { DonationEventService } from "../services/DonationEventService";
import OpenAI from "openai";
import dayjs from "dayjs";

const router = express.Router();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

const donationEventRepository = new DonationEventRepository();
const donationEventService = new DonationEventService(donationEventRepository);

const InstagramTemplate = (
  name: string,
  items: string,
  startDate: string,
  endDate: string,
  caption: string,
  url: string,
) => {
  const result = `[EVENT] ${name}\nItems needed: ${items}\nHappening on ${startDate} to ${endDate}\n\n${caption}\n\nFind out more at ${url}`;
  return result;
};

router.post("/generate-instagram-caption", async (req, res) => {
  const params = req.body;
  const filterParams = strongParams(params, ["donationEventId"]);
  const { donationEventId } = filterParams;
  let eventName;
  let eventItems = "";
  let eventStartDate;
  let eventEndDate;
  let result;

  const prompt = (
    eventName: string,
    items: string,
    startDate: string,
    endDate: string,
  ) => `
    [Start Context] 
    Kunyah Cafe is a food kiosk and a social enterprise whose mission is to provide opportunities for persons with disabilities in Singapore. 
    Currently, it is running donation events to get donors to donate listed items by Kunyah and in exchange, cash back will be given to these donors to offset their meals at the cafe. 
    [End Context]
  
    [EVENT] ${eventName}
    Items needed: ${items}
    Date: ${startDate} to ${endDate}
    
    As a social media manager, write a 80 to 100 words instagram caption that attracts viewers and use vibrant visuals and witty captions to create excitement around the event and give followers a reason to share and tag their friends.
    Strictly limit the amount of emojis to maximum of 3 and do not include hashtags`;

  try {
    const donationEvent =
      await donationEventService.getDonationEventById(donationEventId);
    if (donationEvent) {
      eventName = donationEvent.name;
      eventStartDate = dayjs(donationEvent.startDate).format("DD/MM/YYYY");
      eventEndDate = dayjs(donationEvent.endDate).format("DD/MM/YYYY");
      const donationEventItems = donationEvent.donationEventItems;
      for (const items of donationEventItems) {
        const item = items.item.name;
        if (eventItems.length === 0) {
          eventItems = item;
        } else {
          eventItems += `, ${item}`;
        }
      }
    }

    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt(
            eventName || "",
            eventItems || "",
            eventStartDate || "",
            eventEndDate || "",
          ),
        },
      ],
      model: "gpt-3.5-turbo",
    });

    if (chatCompletion) {
      const url = `http://kunyah.eco-yah.com/`;
      const instaCaption = chatCompletion.choices[0].message.content;
      result = InstagramTemplate(
        eventName || "",
        eventItems || "",
        eventStartDate || "",
        eventEndDate || "",
        instaCaption || "",
        url,
      );
    }
    return generateResponse(res, 200, {
      action: true,
      gptResponse: result,
    });
  } catch (error) {
    return generateResponse(res, 500, {
      action: false,
      message: "Internal Server Error. Please refresh and try again.",
    });
  }
});

export default router;
