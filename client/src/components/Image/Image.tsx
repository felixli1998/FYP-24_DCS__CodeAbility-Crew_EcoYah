enum ImageType {
    Circle = "circle",
    Square = "square",
    Rectangle = "rectangle"
}

enum ImageSource{
    Local = "local",
    S3 = "s3"
}

interface ImageProps{
    imageId: string;
    imageSource: ImageSource;
    type: ImageType;
    width?: string | number;
    height?: string | number;
}
/**
 * This component helps load an image given an imageId and imageSource.
 *
 * @param {string} imageId - The unique identifier of the image.
 * @returns {JSX.ElementType} An image element that renders the image if found, else presents a not found.
 * @throws {Error} Throws an error if the request fails or if the userId is not provided.
 */
export default function Image({}:ImageProps): JSX.Element {
    // Function implementation goes here

    // Example return (adjust as needed)
    return (    
        <div>
            <p>Image</p>
        </div>
    )
}

function getLocalImagePath(imageId:string){
    return `../../assets/images/${imageId}`;
}

function getRemoteImagePath(imageId:string){
    return `https://picsum.photos/id/${imageId}/200/300`;
}

function uploadImage(imageSource:ImageSource): string{
    // Converst image to blob data and uploads it to server
    // Uploads a new image to the server and returns 
    // the imageId of the newly uploaded image.

    return "uuid";
}

