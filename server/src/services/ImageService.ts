import LocalImageRepository from "../repositories/LocalImageRepository";
import OnlineImageRepostitory from "../repositories/OnlineImageRepository";

interface S3Config {
  accessKeyId: string;
  secretAccessKey: string;
}

export class ImageService {
  private static instance: ImageService;
  private repository: LocalImageRepository | OnlineImageRepostitory;
  private static fileSizeLimitInMB = 5;

  private constructor() {
    const repositoryType = process.env.IMAGE_DATABASE || "local"; // Read repository type from environment variable or default to 'local'
    this.setRepository(repositoryType); // Set repository based on the type
  }

  public static getInstance(): ImageService {
    if (!ImageService.instance) {
      ImageService.instance = new ImageService();
    }
    return ImageService.instance;
  }

  public setRepository(type: string): void {
    if (type === "local") {
      console.log("Setting repository to LocalImageRepository");
      this.repository = new LocalImageRepository();
    } else if (type === "online") {
      const config: S3Config = {
        accessKeyId: process.env.S3_ACCESS_KEY || "",
        secretAccessKey: process.env.S3_SECRET || "",
      };
      console.log("OnlineImageRepository created");
      console.log("Config:", config);
      this.repository = new OnlineImageRepostitory(config);
    } else {
      throw new Error("Invalid repository type");
    }
  }

  public async getImage(
    imageId: string,
    prefix?: string,
  ): Promise<Buffer | null> {
    return this.repository.getImage(imageId, prefix);
  }

  public async saveImage(
    imageData: Buffer,
    imageId: string,
    prefix?: string,
  ): Promise<string> {
    if (!this.isAcceptedImageType(imageData)) {
      throw new Error("Invalid image type");
    }
    if (!this.checkFileSize(imageData)) {
      throw new Error("File size exceeds the limit of ");
    }
    return this.repository.saveImage(imageData, imageId, prefix);
  }

  public async updateImage(
    imageData: Buffer,
    imageId: string,
    prefix?: string,
  ): Promise<string> {
    // if (!this.isAcceptedImageType(imageData)) {
    //   throw new Error("Invalid image type");
    // }
    if (!this.checkFileSize(imageData)) {
      throw new Error("File size exceeds the limit of ");
    }
    return this.repository.updateImage(imageData, imageId, prefix);
  }

  public async deleteImage(imageId: string, prefix?: string): Promise<boolean> {
    return this.repository.deleteImage(imageId, prefix);
  }

  public checkFolderExistence(folderName: string): Promise<boolean> {
    return this.repository.checkFolderExistence(folderName);
  }

  public checkFileSize(imageData: Buffer): boolean {
    const maxSizeInBytes = ImageService.fileSizeLimitInMB * 1024 * 1024; // Convert threshold from MB to bytes
    return imageData.length <= maxSizeInBytes;
  }

  public isAcceptedImageType(imageData: Buffer): boolean {
    const supportedTypes = [
      { magicNumber: "89504e47", type: "image/png" },
      { magicNumber: "47494638", type: "image/gif" },
      { magicNumber: "ffd8ffe0", type: "image/jpeg" },
      { magicNumber: "ffd8ffe1", type: "image/jpeg" },
      { magicNumber: "ffd8ffe2", type: "image/jpeg" },
      { magicNumber: "ffd8ffe3", type: "image/jpeg" },
      { magicNumber: "ffd8ffe8", type: "image/jpeg" },
    ];
    const magicNumber = imageData.toString("hex", 0, 4).toLowerCase();
    const matchedType = supportedTypes.find((type) =>
      magicNumber.startsWith(type.magicNumber),
    );
    return !!matchedType; // Convert matchedType to a boolean
  }
}
