import React, { useState, useEffect } from "react";
import axios from "axios";
import ImagePlaceholder from "../../assets/Image_Placeholder.png";
import Image404 from "../../assets/Image_404.jpg";

// MUI
import { Box, Button } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";
import { IMAGE_ROUTES } from "../../services/routes";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

interface ImageProps {
  imageId: string;
  type: "square" | "circle" | "rectangle";
  folderPrefix: string;
  editable?: boolean | false;
  width?: string | number;
  height?: string | number;
}

const defaultProps: ImageProps = {
  imageId: "placeholder", // Points to Image_Placeholder
  folderPrefix: "default", // Default value for imageId
  type: "square",
  editable: false, // Default value for editable
  width: "250px",
  height: "250px",
};

export enum folderPrefixNames {
  DEFAULT = "default",
  DONOR = "donor",
  EVENTS = "events",
  PROFILEPICTURES = "profile-pictures",
}


export default function Image(props: ImageProps): JSX.Element {
  const checkFileSize = (file: File, maxSizeInMB: number = 5): boolean => {
    return file.size <= maxSizeInMB * 1024 * 1024; // Convert MB to bytes
  };
  
  // Function to check file type
  const checkFileType = (file: File): boolean => {
    const supportedTypes = [
        'image/png',
        'image/jpeg'
    ];
    return supportedTypes.includes(file.type);
};

  const [imagePath, setImagePath] = useState<string | undefined>(
    ImagePlaceholder
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const updateImage = async () => {
    if (!selectedFile) {
      console.error("No file selected");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("folderPrefix", props.folderPrefix);

    try {
      const response = await axios.put(
        IMAGE_ROUTES.UPDATE.replace(":id", props.imageId),
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        // Update the displayed image after successful upload
        console.log(`${response.data.data.filename} uploaded successfully`);
        console.log(
          "TODO: This is likely where you update the database with this particular image id, so that on the next refresh it will know which ID to request."
        );
      } else {
        console.error("Failed to update image");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files;
  //   if (files && files.length > 0) {
  //     const file = files[0];
  //     setSelectedFile(file);

  //     // Create a preview of the selected image
  //     const imageUrl = URL.createObjectURL(file);
  //     setImagePath(imageUrl);
  //   }
  // };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
        const file = files[0];
        
        // Check file type
        if (!checkFileType(file)) {
            console.error("Unsupported file type");
            return;
        }
        if (!checkFileSize(file)) {
            console.error("File size exceeds the size limit.");
            return;
        }

        setSelectedFile(file);

        // Create a preview of the selected image
        const imageUrl = URL.createObjectURL(file);
        setImagePath(imageUrl);
    }
};

  useEffect(() => {
    const fetchImage = async () => {
      try {
        if (props.imageId === "placeholder") {
          return;
        }
        const filepath = `${
          props.folderPrefix ? props.folderPrefix + "/" : ""
        }${props.imageId}`;
        const response = await axios.get(
          IMAGE_ROUTES.RETRIEVE_BY_FILE_PATH.replace(":filePath", filepath),
          {
            responseType: "arraybuffer",
          }
        );

        if (response.status === 200 && response.data) {
          const arrayBufferView = new Uint8Array(response.data);
          const blob = new Blob([arrayBufferView], {
            type: response.headers["content-type"],
          });
          const imageUrl = URL.createObjectURL(blob);
          setImagePath(imageUrl);
        } else {
          setImagePath(Image404);
          console.error("Failed to fetch image");
        }
      } catch (error) {
        setImagePath(Image404);
        console.error("Error:", error);
      }
    };

    fetchImage();
  }, []);

  const getStyles = () => {
    switch (props.type) {
      case "circle":
        return { borderRadius: "50%" };
      case "rectangle":
        return { borderRadius: "10px" };
      // Add more cases for other types as needed,
      // Some potential cases are "Donation Item, Poster"
      default:
        return {}; // Default styles for 'square'
    }
  };

  return (
    <Box
      sx={{
        width: props.width,
        marginBottom: props.editable ? "1rem" : "",
      }}
    >
      <img
        src={imagePath}
        alt="Sample Text"
        style={{
          width: "100%",
          height: props.height,
          ...getStyles(),
        }}
      />
      {props.editable && (
        <>
          <Box display="flex" flexDirection={"column"} sx={{}}>
            <Button
              component="label"
              variant="outlined"
              sx={{
                marginBottom: 1,
              }}
              startIcon={<CloudUploadIcon />}
            >
              Upload image
              <VisuallyHiddenInput type="file" onChange={handleFileChange} />
            </Button>
            <Button variant="contained" color="primary" onClick={updateImage}>
              Update Image
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
}

Image.defaultProps = defaultProps;
