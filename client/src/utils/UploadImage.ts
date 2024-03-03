import React from "react";
import axios from "axios";
import { IMAGE_ROUTES } from "../services/routes";

function base64ToFile(inputString:string){
    // Split strinb ase on comma
    const [ mimeType , base64String ]= inputString.split(";base64,");
    // Convert the base64 string to binary data
    const binaryString = atob(base64String);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);

    for (let i = 0; i < len; ++i) {
        bytes[i] = binaryString.charCodeAt(i);
    }

    // Create a Blob object
    const blob = new Blob([bytes], { type: mimeType });

    // Create a File object
    const file = new File([blob], "temp_file", { type: mimeType });
    return file;
}

export async function uploadImage(folderPrefix: string, base64String: string): Promise<string> {
    if (!base64String) {
        console.error("No file selected");
    }

    const file = base64ToFile(base64String);

    // Creating form data
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folderPrefix", folderPrefix);

    try {
        const response = await axios.post(
            IMAGE_ROUTES.CREATE,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            },
        );

        if (response.status === 200) {
            // Update the displayed image after successful upload
            return response.data.data.filename;
        } else {
            console.error("Failed to update image");
            return "";
        }
    } catch (error) {
        console.error("Error:", error);
        return "";
    }
}