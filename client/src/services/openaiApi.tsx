import axios from "axios";
import { OPENAI_ROUTES } from "./routes";
import { EMAIL_ROUTES } from "./routes";
import { INSTAGRAM_ROUTES } from "./routes";

// Generate instagram caption using OpenAI
export const generateInstaCaption = async (donationEventId: string) => {
  try {
    const res = await axios.post(OPENAI_ROUTES.GENERATE_INSTAGRAM_CAPTION, {
      donationEventId: donationEventId,
    });
    return res.data.data.gptResponse;
  } catch (error) {
    console.error("Error generating instagram caption: ", error);
    throw new Error("Error generating instagram caption");
  }
};

export const NotifyNewEvents = async (
  donationEventName: string,
  captionText: string,
) => {
  try {
    const res = await axios.post(EMAIL_ROUTES.NOTIFY_NEW_EVENTS, {
      donationEventName: donationEventName,
      captionText: captionText,
    });
    return res.data;
  } catch (error) {
    console.error("Error sending email: ", error);
    throw new Error("Error sending email");
  }
};

export const PublishIgContent = async (image: string, captionText: string) => {
  try {
    const res = await axios.post(INSTAGRAM_ROUTES.PUBLISH_CONTENT, {
      image: image,
      captionText: captionText,
    });
    return res.data;
  } catch (error) {
    console.error("Error publishing IG content: ", error);
    throw new Error("Error publishing IG content");
  }
};
