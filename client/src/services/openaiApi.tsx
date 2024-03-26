import axios from "axios";
import { OPENAI_ROUTES } from "./routes";

// Generate instagram caption using OpenAI
export const generateInstaCaption = async (donationEventId: string) => {
  try {
    const res = await axios.post(OPENAI_ROUTES.GENERATE_INSTAGRAM_CAPTION, {
      donationEventId: donationEventId,
    });
    return res.data.data.gptResponse;
  } catch (error) {
    console.error("Error making cashback request: ", error);
    throw new Error("Error making cashback request");
  }
};
