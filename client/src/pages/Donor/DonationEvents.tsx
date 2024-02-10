import {useState, useEffect } from "react";
import DonationEventCard from "../../components/DonationEvent/DonationEventCard";
import { fetchDonationEvents } from '../../services/donationEventApi';

import {
    Box,
    Container,
    Grid,
    Typography,
    Avatar,
    ListItemAvatar,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    IconButton
  } from '@mui/material';

type eventType = {
    createdAt: string,
    endDate: string,
    id: number,
    imageId: string,
    isActive: boolean,
    name: string,
    startDate: string,
    updatedAt: string
}

export default function DonationEvents() {
    const [events, setEvents] = useState([]);
    const [errorFetchingEvents, setErrorFetchingEvents] = useState(false);

    const getAllEvents = async () => {
        try {
            // const response = await fetch('http://localhost:8000/donation-events/all');
            // const data = await response.json();
            // return data;
            const response = await fetchDonationEvents("");
            console.log(response);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            setErrorFetchingEvents(true);
            throw error;
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getAllEvents();
                console.log(res)
                setEvents(res);
            } catch (error) {
                console.error('Error:', error);
                setErrorFetchingEvents(true);
            }
        }
        fetchData();
    }, []);

    return (
        <Container sx={{marginTop: 3, marginX: 3}}>
            <Typography variant='h5' sx={{fontWeight: 'bold', marginBottom: 2}}>Donation of the Week</Typography>
            
            <DonationEventCard
                name='Example'
                description='This is an example description'
                imgSrc="https://picsum.photos/200/300"
                numJoined={8}
                numHoursLeft={8}
            />
            
            <Typography sx={{fontWeight: 'bold', marginY: 2}}>Donation Categories</Typography>

            <Grid container spacing={3}>
                {events.map((event: eventType) => (
                    <Grid item sx={{marginBottom: 2}}>
                        <DonationEventCard
                            name={event.name}
                            description='This is an example description'
                            imgSrc={event.imageId}
                            numJoined={8}
                            numHoursLeft={8}
                        />
                    </Grid>
                ))}
            </Grid>
        </Container>
        // <div>
        //     <h1>Donation Events</h1>
        //     <ul>
        //         {events.map((event) => (
        //             <li key={event.id}>
        //                 <h2>{event.name}</h2>
        //                 <p>{event.description}</p>
        //             </li>
        //         ))}
        //     </ul>
        // </div>
    );
}