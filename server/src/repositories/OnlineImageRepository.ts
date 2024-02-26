import ImageRepositoryInterface from "./ImageRepositoryInterface";
import AWS, { S3 } from "aws-sdk";

// Interface for the configuration options
interface S3Config {
  accessKeyId: string;
  secretAccessKey: string;
}

export default class OnlineImageRepository implements ImageRepositoryInterface {
  private s3: S3;
  private bucketName: string = process.env.S3_BUCKET || "";

  constructor(private config: S3Config) {
    this.s3 = new AWS.S3(this.config);
  }

  async checkFolderExistence(prefix: string): Promise<boolean> {
    const params = {
      Bucket: this.bucketName,
      Prefix: prefix + "/",
    };
    try {
      const data = await this.s3.listObjectsV2(params).promise();
      if (data.Contents === undefined) {
        return false;
      }
      return data.Contents.length > 0; // Folder exists if there are objects inside
    } catch (error) {
      console.error("Error checking folder existence:", error);
      return false; // Assume folder does not exist if there's an error
    }
  }

  async saveImage(
    imageData: Buffer,
    imageId: string,
    prefix: string = "default",
  ): Promise<string> {
    const params: S3.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: `${prefix}/${imageId}`,
      Body: imageData,
      ContentType: "image/jpeg", // Specify the content type here
    };

    try {
      const data = await this.s3.upload(params).promise();
      return data.Location; // Return the URL of the uploaded image
    } catch (error) {
      console.error("Error saving image:", error);
      throw error;
    }
  }

  async updateImage(
    imageData: Buffer,
    newImageId: string,
    prefix: string = "default",
  ): Promise<string> {
    // To update an image, you can simply upload a new image with the new key
    return await this.saveImage(imageData, newImageId, prefix);
  }

  async getImage(
    imageId: string,
    prefix: string = "default",
  ): Promise<Buffer | null> {
    const params: S3.GetObjectRequest = {
      Bucket: this.bucketName,
      Key: `${prefix}/${imageId}`,
    };

    try {
      const data = await this.s3.getObject(params).promise();
      return data.Body as Buffer; // Return the image data
    } catch (error) {
      if (
        (error as AWS.AWSError) &&
        (error as AWS.AWSError).code === "NoSuchKey"
      ) {
        return null; // Return null if the image is not found
      }
      throw error;
    }
  }

  async deleteImage(
    imageId: string,
    prefix: string = "default",
  ): Promise<boolean> {
    const params: S3.DeleteObjectRequest = {
      Bucket: this.bucketName,
      Key: `${prefix}/${imageId}`,
    };

    try {
      await this.s3.deleteObject(params).promise();
      return true; // Return true if the image is deleted successfully
    } catch (error) {
      console.error("Error deleting image:", error);
      return false;
    }
  }
}
