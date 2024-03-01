import express, { Request, Response } from "express";
import multer, { MulterError } from "multer";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

import { ImageService } from "../services/ImageService";
import { generateResponse } from "../common/methods";

const router = express.Router();
const imageService = ImageService.getInstance(); // Create an instance of ImageService

const storage = multer.diskStorage({
  destination: "./uploaded_images",
  filename: function (req, file, cb) {
    // Use the generated UUID as the filename
    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage }).array("file");

router.get("/:folderPrefix/:imageId", async function (req, res) {
  const folderPrefix = req.params.folderPrefix;
  const imageId = req.params.imageId;
  const imageData = await imageService.getImage(imageId, folderPrefix);
  if (imageData) {
    res.setHeader("Content-Type", "image/jpeg");
    res.send(imageData);
  } else {
    generateResponse(res, 404, "Image not found");
  }
});

router.post("/", function (req: Request, res: Response) {
  upload(req, res, async function (err) {
    if (err instanceof MulterError) {
      return generateResponse(res, 500, {
        error: "MulterError",
        message: err.message,
      });
    } else if (err) {
      return generateResponse(res, 500, {
        error: "UnknownError",
        message: err.message,
      });
    }

    const prefix = req.body.folderPrefix || "default";

    const folderExists = await imageService.checkFolderExistence(prefix);
    if (!folderExists) {
      return generateResponse(res, 404, { message: "Folder not found" });
    }

    const uploadedFiles: Express.Multer.File[] =
      req.files as Express.Multer.File[];
    const promises = uploadedFiles.map((file) =>
      imageService.saveImage(fs.readFileSync(file.path), file.filename, prefix),
    );

    try {
      await Promise.all(promises);
      return generateResponse(res, 200, {
        success: true,
        message: "Files uploaded successfully",
        filename: uploadedFiles.map((file) => file.filename),
      });
    } catch (error) {
      return generateResponse(res, 500, { message: "Internal server error" });
    }
  });
});

router.put("/:imageId", function (req: Request, res: Response) {
  // This function is a false update.
  // It does not delete the old image from the server.
  // It simply uploads a new image and returns a new unique ID.
  // The unique ID should be saved into our database.
  upload(req, res, async function (err) {
    const folderPrefix = req.body.folderPrefix || "default"; // Default prefix if not provided

    if (err instanceof MulterError) {
      return generateResponse(res, 500, {
        error: "MulterError",
        message: err.message,
      });
    } else if (err) {
      return generateResponse(res, 500, {
        error: "UnknownError",
        message: err.message,
      });
    }

    const folderExists = await imageService.checkFolderExistence(folderPrefix);
    if (!folderExists) {
      return generateResponse(res, 404, { message: "Folder not found" });
    }

    const uploadedFiles: Express.Multer.File[] =
      req.files as Express.Multer.File[];

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return generateResponse(res, 400, { message: "No file uploaded" });
    }

    const promises = uploadedFiles.map((file) =>
      imageService.updateImage(
        fs.readFileSync(file.path),
        file.filename,
        folderPrefix,
      ),
    );

    try {
      await Promise.all(promises);
      return generateResponse(res, 200, {
        success: true,
        message:
          "Files updated successfully! Please update database entry for images too.",
        filename: uploadedFiles.map((file) => file.filename),
      });
    } catch (error) {
      console.error("Error:", error);
      return generateResponse(res, 500, { message: "Internal server error" });
    }
  });
});

export default router;
