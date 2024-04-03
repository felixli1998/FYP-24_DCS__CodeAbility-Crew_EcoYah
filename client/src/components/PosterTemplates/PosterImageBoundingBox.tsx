import { Box } from "@mui/material";
import Image from "../../components/Image/Image";

interface PosterImageBoundingBoxProps {
    imageId: string;
    folderPrefix: string;
    style?: React.CSSProperties;
    imageScale?: number;
    imageLeftShift?: string;
    imageTopShift?: string;
}

export default function PosterImageBoundingBox({
    imageId,
    folderPrefix,
    style,
    imageScale=1,
    imageLeftShift="0",
    imageTopShift="0"
}: PosterImageBoundingBoxProps) {
    return (
        <Box
            style={{
                position: 'relative',
                overflow: 'hidden', // Clip content that overflows the box
                ...style // Merge additional styles passed from props
            }}
        >
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'rgba(0, 0, 0, 0)', // Semi-transparent mask
                    zIndex: 1 // Ensure the mask is above the image
                }}
            />
            <Image
                imageId={imageId}
                height={`${100 * imageScale}%`} // Scale the height
                width={`${100 * imageScale}%`} // Scale the width
                imageLeftShift={imageLeftShift} // Shift the image left
                imageTopShift={imageTopShift} // Shift the image top
                folderPrefix={folderPrefix}
            />
        </Box>
    );
}
