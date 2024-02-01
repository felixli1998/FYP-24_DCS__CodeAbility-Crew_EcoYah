import express, { Request, Response, NextFunction } from 'express';
import multer, { MulterError } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

const router = express.Router();

const storage = multer.diskStorage({
  destination: './uploaded_images',
  filename: function (req, file, cb) {
    // Use the generated UUID as the filename
    const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage }).array('file');

router.get('/:imageId', function (req, res, next) {
  const imageId = req.params.imageId;
  const uploadedImagesPath = './uploaded_images';
  // Replace this with your logic to retrieve the image path based on the imageId
  const imagePath = `${uploadedImagesPath}/${imageId}`;
  console.log(imagePath);
  try {
    // Check if the file exists
    if (fs.existsSync(imagePath)) {
      // Read the image file and send it in the response
      const imageStream = fs.createReadStream(imagePath);
      imageStream.pipe(res);
    } else {
      res.status(404).json({ success: false, message: 'Image not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

router.post('/', function (req: Request, res: Response, next: NextFunction) {
  // TODO: Add in checks for file type and single item.z
  upload(req, res, function (err) {
    if (err instanceof MulterError) {
      return res
        .status(500)
        .json({ error: 'MulterError', message: err.message });
    } else if (err) {
      return res
        .status(500)
        .json({ error: 'UnknownError', message: err.message });
    }
    const uploadedFiles: Express.Multer.File[] =
      req.files as Express.Multer.File[];
    // Assuming you want to send the UUID of the uploaded file in the response
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: 'No file uploaded' });
    }
    return res.status(200).json({
      success: true,
      message: 'File uploaded successfully',
      filename: uploadedFiles[0].filename,
    });
  });
});
router.put(
  '/:imageId',
  function (req: Request, res: Response, next: NextFunction) {
    upload(req, res, async function (err) {
      if (err instanceof MulterError) {
        return res
          .status(500)
          .json({ error: 'MulterError', message: err.message });
      } else if (err) {
        return res
          .status(500)
          .json({ error: 'UnknownError', message: err.message });
      }

      const uploadedFiles: Express.Multer.File[] =
        req.files as Express.Multer.File[];

      if (!uploadedFiles || uploadedFiles.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: 'No file uploaded' });
      }

      const imageId = req.params.imageId;
      const uploadedImagesPath = './uploaded_images';
      const imagePath = `${uploadedImagesPath}/${uuidv4()}`;

      return res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        filename: uploadedFiles[0].filename,
      });
    });
  }
);

export default router;
