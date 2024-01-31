import * as React from 'react';
import { Typography } from '@mui/material';

type StaffTypographyProps = {
    type: string
    size: number
    text: string | InnerHTML
    customStyles?: React.CSSProperties
}


export default function StaffTypography(props: StaffTypographyProps) {

    // map the component, color, fontWeight
    const sxMapping: any = {
        "title": ["", "primary.dark", "bold"], 
        "helperText": ["span", "error.main", ""],
    }

    return (
        <Typography component={sxMapping[props.type][0]} gutterBottom 
            dangerouslySetInnerHTML={{ __html: props.text }}
            sx={{ 
                color: sxMapping[props.type][1], 
                fontSize: props.size + "rem", 
                letterSpacing: props.size * 0.12 + "rem", 
                fontWeight: sxMapping[props.type][2],
                ...props.customStyles
                }} />
    );
}