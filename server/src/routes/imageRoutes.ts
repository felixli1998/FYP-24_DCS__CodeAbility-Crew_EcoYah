import express, { Request, Response, NextFunction } from 'express';
import multer, { MulterError } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

import { ImageService } from '../services/ImageService';

const router = express.Router();
const imageService = ImageService.getInstance(); // Create an instance of ImageService

const storage = multer.diskStorage({
    destination: './uploaded_images',
    filename: function (req, file, cb) {
        // Use the generated UUID as the filename
        const fileName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, fileName);
    },
});

const upload = multer({ storage: storage }).array('file');

router.get('/:folderPrefix/:imageId', async function (req, res, next) {
    const folderPrefix = req.params.folderPrefix;
    const imageId = req.params.imageId;
    const imageData = await imageService.getImage(imageId, folderPrefix);
    if (imageData) {
        res.setHeader('Content-Type', 'image/jpeg'); 
        res.send(imageData);
    } else {
        res.status(404).json({ success: false, message: 'Image not found' });
    }
});

router.post('/', function (req: Request, res: Response, next: NextFunction) {
    upload(req, res, async function (err) {
        if (err instanceof MulterError) {
            return res.status(500).json({ error: 'MulterError', message: err.message });
        } else if (err) {
            return res.status(500).json({ error: 'UnknownError', message: err.message });
        }

        const prefix = req.body.folderPrefix || 'default'; // Default prefix if not provided
        const uploadedFiles: Express.Multer.File[] = req.files as Express.Multer.File[];
        const promises = uploadedFiles.map(file => imageService.saveImage(fs.readFileSync(file.path), file.filename, prefix));

        try {
            await Promise.all(promises);
            res.status(200).json({
                success: true,
                message: 'Files uploaded successfully',
                filenames: uploadedFiles.map(file => file.filename),
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    });
});

router.put('/:imageId', function (req: Request, res: Response, next: NextFunction) {
    upload(req, res, async function (err) {
        if (err instanceof MulterError) {
            return res.status(500).json({ error: 'MulterError', message: err.message });
        } else if (err) {
            return res.status(500).json({ error: 'UnknownError', message: err.message });
        }

        const imageId = req.params.imageId;
        const uploadedFiles: Express.Multer.File[] = req.files as Express.Multer.File[];

        if (!uploadedFiles || uploadedFiles.length === 0) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const promises = uploadedFiles.map(file => imageService.updateImage(fs.readFileSync(file.path), file.filename, imageId));

        try {
            await Promise.all(promises);
            res.status(200).json({
                success: true,
                message: 'Files updated successfully! Please update database entry for images too.',
                filenames: uploadedFiles.map(file => file.filename),
            });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    });
});

export default router;