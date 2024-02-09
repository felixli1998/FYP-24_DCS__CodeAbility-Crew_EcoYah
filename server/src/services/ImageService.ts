import LocalImageRepository from "../repositories/LocalImageRepository";
import  OnlineImageRepostitory from "../repositories/OnlineImageRepository"

interface S3Config {
    accessKeyId: string;
    secretAccessKey: string;
}

export class ImageService {
    private static instance: ImageService;
    private repository: LocalImageRepository | OnlineImageRepostitory;

    private constructor() {
        const repositoryType = process.env.IMAGE_DATABASE || 'local'; // Read repository type from environment variable or default to 'local'
        this.setRepository(repositoryType); // Set repository based on the type
    }

    public static getInstance(): ImageService {
        if (!ImageService.instance) {
            ImageService.instance = new ImageService();
        }
        return ImageService.instance;
    }

    public setRepository(type: string): void {
        if (type === 'local') {
            console.log(
                'Setting repository to LocalImageRepository'
            );
            this.repository = new LocalImageRepository();
        } else if (type === 'online') {
            const config: S3Config = {
                accessKeyId: process.env.S3_ACCESS_KEY || '',
                secretAccessKey: process.env.S3_SECRET
                    || '',
            };
            console.log("OnlineImageRepository created");
            console.log("Config:", config);
            this.repository = new OnlineImageRepostitory(config);
        } else {
            throw new Error('Invalid repository type');
        }
    }

    public async getImage(imageId: string, prefix?:string): Promise<Buffer | null> {
        return this.repository.getImage(imageId, prefix);
    }

    public async saveImage(imageData: Buffer, imageId: string, prefix?: string): Promise<string> {
        return this.repository.saveImage(imageData, imageId, prefix);
    }

    public async updateImage(imageData: Buffer, imageId: string, prefix?: string): Promise<string> {
        return this.repository.updateImage(imageData, imageId, prefix);
    }


    public async deleteImage(imageId: string, prefix?: string): Promise<boolean> {
        return this.repository.deleteImage(imageId, prefix);
    }

    public checkFolderExistence(folderName: string): Promise<boolean> {
        return this.repository.checkFolderExistence(folderName);
    }
}
