import { Box } from "@mui/material";

type RoundProfilePicProps = {
    pictureSrc: string;
    altText: string
}

export default function RoundProfilePic(props: RoundProfilePicProps) {
    return (
        <>
        <Box
            component="img"
            display="flex"
            justifyContent="center"
            sx={{
                marginX: "auto",
                marginTop: 4,
                marginBottom: 2,
                width: "8rem",
                height: "8rem",
                borderRadius: "50%",
                boxShadow:
                    "0px 2px 6px 0px rgba(0, 0, 0, 0.25), 0 0 10px rgba(0, 0, 0, 0.2) inset",
            }}
            alt={props.altText}
            src={props.pictureSrc}
        ></Box>
        </>
    )
};