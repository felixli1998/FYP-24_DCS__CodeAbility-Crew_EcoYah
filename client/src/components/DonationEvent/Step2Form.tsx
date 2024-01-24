import { useState } from "react";
import { Typography, Grid, Box, Stack, TextField, InputAdornment } from '@mui/material';


export default function Step2Form() {

    const all_items = [ 
        { item: "Broccoli", unit: "Kilogram" }, 
        { item: "Lettuce", unit: "Kilogram" }, 
        { item: "Chocolate Milk", unit: "Litre" }, 
        { item: "Apple Juice", unit: "Litre" }
    ];

    const [items, setItems] = useState(all_items);
   
    return (
        <>
        <Typography variant="h5" gutterBottom>Fill up the information for each donation item</Typography>
        <Grid container justifyContent="space-between" sx={{ p: 2 }}>
            { items.map(function(label, i) {
                    return <Grid item xs={12} md={6} lg={6} sx={{ marginBottom: "1rem" }} key={i}>
                        <Box
                            component="form"
                            display="flex"
                            justifyContent="center"
                            alignItems="center"
                            sx={{ width: 400, m: "auto",
                            '& > :not(style)': { m: "1rem", p: "1rem" }, boxShadow: 5, borderRadius: 2, 
                            }}
                            noValidate
                            autoComplete="off">
                            <Stack spacing={5}>
                                <Typography variant="h6" gutterBottom>Item {i+1}: {items[i].item}</Typography>
                                <TextField label="Minimum Quantity" type="number" 
                                    InputProps={{ endAdornment: <InputAdornment position="end">{items[i].unit}</InputAdornment> }}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ width: 300 }}>Minimum Quantity</TextField>
                                <TextField label="Target Quantity" type="number" 
                                    InputProps={{ endAdornment: <InputAdornment position="end">{items[i].unit}</InputAdornment> }}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ width: 300 }}>Target Quantity</TextField>
                                <TextField label={`Points Per ${items[i].unit}`} type="number" 
                                    InputProps={{ endAdornment: <InputAdornment position="end">{items[i].unit}</InputAdornment> }}
                                    InputLabelProps={{ shrink: true }}
                                    sx={{ width: 300 }} />
                            </Stack>
                        </Box> 
                </Grid>  }) }
            </Grid>
        </>
    );
};