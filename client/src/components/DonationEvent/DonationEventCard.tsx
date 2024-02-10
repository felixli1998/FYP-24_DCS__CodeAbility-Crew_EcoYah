import { useState, useEffect } from 'react';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import {
    Button,
    Box,
    Container,
    Typography,
    Avatar,
    ListItemAvatar,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    IconButton,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Grid
  } from '@mui/material';

type DonationEventCardProps = {
    name: string;
    description: string;
    imgSrc: string;
    numJoined: number;
    numHoursLeft: number;
} 

export default function DonationEventCard(props: DonationEventCardProps) {
    return (
        <Card sx={{ width:"400px", borderRadius: '25px'}} elevation={2}>
            <CardMedia
                component="img" 
                image={props.imgSrc}
                height='200px'
                title={props.name}
                sx={{padding: 2, borderRadius: '25px'}}
            />
            <CardContent>
                <Grid container alignItems='center'>
                    <Grid item xs={8}>
                        <Typography variant='h6' sx={{fontWeight: 'bold'}}>{props.name}</Typography>
                    </Grid>
                    <Grid item xs={4} container justifyContent='flex-end'>
                        {/* <CardActions> */}
                            <Button variant='contained' size='medium'>Donate</Button>
                        {/* </CardActions> */}
                    </Grid>
                </Grid>
                
                <Typography mt={2}>{props.description}</Typography>

                <Grid container alignItems='center' sx={{marginTop: 2}}>
                    <Grid item xs={7}>
                        <Typography color="text.secondary">
                            {props.numJoined > 0 ? `${props.numJoined} Donors Have Joined!` : "Be the first to make a difference!"}
                        </Typography>
                    </Grid>
                    <Grid item xs={5} container justifyContent='flex-end' alignItems='center'>
                        <AccessTimeIcon sx={{ color: 'text.secondary', marginRight: 1}}/>
                        <Typography color='text.secondary'>
                           {props.numHoursLeft} Hours Left
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
}