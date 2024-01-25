import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface ImageProps {
  imageId: string;
  imageSource: "local" | "s3";
  type: "square" | "circle" | "rectangle";
  folderPrefix?: string;
  editable?: boolean | false;
  width?: string | number;
  height?: string | number;
}

const defaultProps: ImageProps = {
  imageId: "1.png",  // Default value for imageId
  imageSource: "local",
  type: "square",
  editable: false,  // Default value for editable
  width: "250px",
  height: "250px",
};

export default function Image(props: ImageProps): JSX.Element {
  const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
  const [imagePath, setImagePath] = useState<string | undefined>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const updateImage = async () => {
    if (!selectedFile) {
      console.error('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.put(`${BACKEND_URL}/images/${props.imageId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        // Update the displayed image after successful upload
        console.log(`${response.data.filename} uploaded successfully`);
        console.log(
          "TODO: This is likely where you update the database with this particular image id, so that on the next refresh it will know which ID to request."
        )
      } else {
        console.error('Failed to update image');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedFile(file);

      // Create a preview of the selected image
      const imageUrl = URL.createObjectURL(file);
      setImagePath(imageUrl);
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      console.log("This should run")
      try {
        const filepath = `${props.folderPrefix ? props.folderPrefix + "/" : ""}${props.imageId}`;
        const response = await axios.get(`${BACKEND_URL}/images/${filepath}`, {
          responseType: 'arraybuffer',
        });

        if (response.status === 200) {
          const arrayBufferView = new Uint8Array(response.data);
          const blob = new Blob([arrayBufferView], { type: response.headers['content-type'] });
          const imageUrl = URL.createObjectURL(blob);
          setImagePath(imageUrl);
        } else {
          console.error('Failed to fetch image');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchImage();
  }, []);

  return (
    <div>
      <img
        src={imagePath}
        alt="Image"
        style={{
          width: props.width,
          height: props.height,
          borderRadius: props.type === "circle" ? "50%" : "0%",
        }}
      />
      {props.editable && (
        <>
          <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={updateImage}>Update Image</button>
          </div>
        </>
      )}
    </div>
  );
}

Image.defaultProps = defaultProps;
