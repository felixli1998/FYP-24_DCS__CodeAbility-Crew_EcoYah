// ImageRepository.ts
interface ImageRepositoryInterface {
    saveImage(imageData: Buffer, imageId:string): Promise<string>;
    updateImage(imageData: Buffer,imageId:string): Promise<string>;
    getImage(imageId:string): Promise<Buffer | null>;
    deleteImage(imageId:string): Promise<boolean>;
}

export default ImageRepositoryInterface;
