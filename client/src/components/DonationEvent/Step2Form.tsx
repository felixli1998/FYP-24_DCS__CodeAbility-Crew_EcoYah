import { useState, useEffect, ChangeEvent } from "react";
import { Grid, Box, Stack, TextField, InputAdornment } from '@mui/material';
import StaffTypography from "../Typography/StaffTypography";

type Step2FormProps = {
    validate: boolean
    data: (key: string, value: any) => void
    back: boolean
    prevData: any
}

export default function Step2Form(props: Step2FormProps) {

    const itemFields = [ 'Minimum Quantity', 'Target Quantity', 'Points Per ' ];
    const itemKeys = [ 'minQty', 'targetQty', 'pointsPerUnit' ];

    const allItems = [ 
        { item: "Broccoli", unit: "Kilogram" }, 
        { item: "Lettuce", unit: "Kilogram" }, 
        // { item: "Chocolate Milk", unit: "Litre" }, 
        // { item: "Apple Juice", unit: "Litre" }
    ];

    const [items, setItems] = useState(allItems);
    const [itemsInfo, setItemsInfo] = useState(() => {
        if (props.back && props.prevData['donationEventItems']) {
            return props.prevData['donationEventItems'];
        } else {
            return allItems.map(item => ({ ...{ minQty: '', targetQty: '', pointsPerUnit: '' } }));
        }
    });

    const handleTextChange = (itemKey: string, index: number) => (event: ChangeEvent<HTMLInputElement>) => {
        setItemsInfo((prevData: any) => {
            const updatedItemsInfo = [...prevData];
            updatedItemsInfo[index] = {
                ...updatedItemsInfo[index],
                "name": items[index].item,
                "unit": items[index].unit,
                [itemKey]: parseFloat(event.target.value),
            };
            return updatedItemsInfo;
        });
    }

    // console.log(itemsInfo);


    useEffect(() => {
        // check that each value is neither empty nor NaN, then update the state
        if (itemsInfo.every((item: { [s: string]: any; })=> Object.values(item).every(value => value !== "" && !Number.isNaN(value)))) {
            props.data('donationEventItems', itemsInfo);
        } else {
            props.data('donationEventItems', []);
        }
    }, [itemsInfo]);
   
    return (
        <>
        <StaffTypography type="title" size={1.5} text="Fill up the information for each donation item" />
        <Grid container justifyContent="space-between" sx={{ p: 2 }}>
            { items.map(function(item, i) {
                    return <Grid item xs={12} md={12} lg={6} sx={{ marginBottom: "1rem", }} key={i}>
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
                                <StaffTypography type="title" size={1.5} text={"Item " + (i+1) + ": " + items[i].item } />
                                { itemFields.map(function(field, j) {
                                    return <TextField key={j} label={ (j !== 2) ? itemFields[j] : itemFields[j] + items[i].unit } 
                                        type="number" 
                                        InputProps={{ endAdornment: <InputAdornment position="end">{ (j !== 2) && items[i].unit }</InputAdornment> }}
                                        InputLabelProps={{ shrink: true }}
                                        sx={{ width: 350 }}
                                        value={itemsInfo[i] && itemsInfo[i][itemKeys[j]] ? itemsInfo[i][itemKeys[j]] : ''}
                                        onChange={handleTextChange(itemKeys[j], i)} 
                                        error={ (props.validate && !itemsInfo[i]) || (props.validate && itemsInfo[i] && !itemsInfo[i][itemKeys[j]]) }
                                        helperText={ ((props.validate && !itemsInfo[i]) || (props.validate && itemsInfo[i] && !itemsInfo[i][itemKeys[j]])) && <StaffTypography type="helperText" size={1.5} text="Please enter a number" /> } /> }) }
                            </Stack>
                        </Box> 
                </Grid>  }) }
            </Grid>
        </>
    );
};