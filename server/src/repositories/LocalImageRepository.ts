import ImageRepositoryInterface from "./ImageRepositoryInterface";
import fs from 'fs';
import { promisify } from 'util';
import path from 'path';

const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);
const unlinkAsync = promisify(fs.unlink);
const mkdirAsync = promisify(fs.mkdir);
const renameAsync = promisify(fs.rename);

export default class LocalImageRepository implements ImageRepositoryInterface {
    static tempFolder = './uploaded_images/temp';
    static destinationParent = './uploaded_images';

    async checkFolderExistence(prefix: string): Promise<boolean> {
        return fs.existsSync(path.join(LocalImageRepository.destinationParent, prefix));
    }

    async getImage(imageId: string, prefix: string = 'default'): Promise<Buffer | null> {
        const imagePath = this.getImagePath(imageId, prefix);
        try {
            if (fs.existsSync(imagePath)) {
                const imageData = await readFileAsync(imagePath);
                return imageData;
            } else {
                return null;
            }
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal server error');
        }
    }
    
    async saveImage(imageData: Buffer, imageId: string, prefix: string = 'default'): Promise<string> {
        const tempImagePath = this.getTempImagePath(imageId);
        const finalImagePath = this.getImagePath(imageId, prefix);
        
        try {
            // Ensure the directories exist for both temporary and final images
            // Write the image data to the temporary path
            await writeFileAsync(tempImagePath, imageData);
    
            // Rename the temporary image to the final path
            await renameAsync(tempImagePath, finalImagePath);
    
            // Remove the temporary file
            await unlinkAsync(LocalImageRepository.destinationParent + "/" + imageId);
    
            return finalImagePath;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal server error');
        }
    }

    async updateImage(imageData: Buffer, newImageId: string, prefix: string = 'default'): Promise<string> {
        const tempImagePath = this.getTempImagePath(newImageId);
        const finalImagePath = this.getImagePath(newImageId, prefix);
        
        try {
            await writeFileAsync(tempImagePath, imageData);
            await renameAsync(tempImagePath, finalImagePath);
            return finalImagePath;
        } catch (error) {
            console.error('Error:', error);
            throw new Error('Internal server error');
        }
    }

    async deleteImage(imageId: string, prefix: string = 'default'): Promise<boolean> {
        const imagePath = this.getImagePath(imageId, prefix);
        try {
            if (fs.existsSync(imagePath)) {
                await unlinkAsync(imagePath);
                return true;
            } else {
                return false;
        }
        } catch (error) {
            console.error('Error:', error);
            return false;
        }
    }

    private getImagePath(imageId: string, prefix: string): string {
        return path.join(LocalImageRepository.destinationParent, prefix, imageId);
    }

    private getTempImagePath(imageId: string): string {
        return path.join(LocalImageRepository.tempFolder, imageId);
    }
}
