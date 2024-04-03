// External Imports
import express from "express";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Instagram = require("instagram-web-api");
import fs from "fs";
import path from "path";

// Internal Imports
import { strongParams, generateResponse } from "../common/methods";

const router = express.Router();

const username = process.env.IG_USERNAME;
const password = process.env.IG_PASSWORD;

const client = new Instagram({ username, password });

async function postImage(photo: string, caption: string) {
  await client.login(
    { username: username, password: password },
    { _sharedData: false },
  );
  await client.uploadPhoto({ photo, caption, post: "feed" });
}

router.post("/publish-ig-content", async (req, res) => {
  const params = req.body;
  const allowedParams = ["image", "captionText"];
  const filteredParams = strongParams(params, allowedParams);

  if (!filteredParams.image || !filteredParams.captionText) {
    return generateResponse(res, 400, {
      message: "Missing required parameters",
    });
  }

  const base64Data = filteredParams.image.replace(
    /^data:image\/jpeg;base64,/,
    "",
  );
  const uniqueFilename = `poster-${Date.now()}.jpg`;
  const imagePath = path.join(
    __dirname,
    "../../uploaded_images/",
    uniqueFilename,
  );
  const caption = filteredParams.captionText;

  try {
    const imageBuffer = Buffer.from(base64Data, "base64");
    fs.writeFile(imagePath, imageBuffer, async (err) => {
      if (err) {
        console.error("Error saving image:", err);
        return generateResponse(res, 500, { message: "Internal Server Error" });
      }

      try {
        await postImage(imagePath, caption);
        await fs.promises.unlink(imagePath);
        return generateResponse(res, 201, {
          message: "Content published successfully!",
        });
      } catch (error) {
        console.error("Error publishing content:", error);
        return generateResponse(res, 500, { message: "Internal Server Error" });
      }
    });
  } catch (error) {
    console.error("Error handling request:", error);
    return generateResponse(res, 500, { message: "Internal Server Error" });
  }
});

export default router;
