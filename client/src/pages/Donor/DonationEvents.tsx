import {useState, useEffect } from "react";
import DonationEventCard from "../../components/DonationEvent/DonationEventCard";
import { fetchActiveDonationEvents } from '../../services/donationEventApi';
import { fetchEventTypes } from '../../services/eventTypesApi';
import { getDonationEventItemsByDonationId } from '../../services/donationEventItemApi';

import {
    Box,
    Chip,
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

type itemDetailsType = {
    id: number,
    name: string,
    unit: string
}

type itemsType = {
    id: number,
    item: itemDetailsType,
    minQty: number,
    pointsPerUnit: number
}

type eventType = {
    id: number,
    items: itemsType[],
    startDate: string,
    endDate: string,
    imageId: string,
    isActive: boolean,
    name: string,
    createdAt: string,
    updatedAt: string
}

export default function DonationEvents() {
    const [events, setEvents] = useState<eventType[]>([]);
    const [errorFetchingEvents, setErrorFetchingEvents] = useState(false);

    const [eventTypes, setEventTypes] = useState([]);

    const getAllEvents = async () => {
        try {
            const response = await fetchActiveDonationEvents("");
            console.log(response);
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            setErrorFetchingEvents(true);
        }
    }

    const getAllEventTypes = async () => {
        try {
            const response = await fetchEventTypes();
            console.log(response);
            return response.data.eventTypes;
        } catch (error) {
            console.error('Error:', error);
            // throw error;
        }
    }

    const getDonationEventItems = async (donationEventId: number) => {
        try {
            const res = await getDonationEventItemsByDonationId(donationEventId);
            console.log(res.data.items);
            return res.data.items;
        } catch (error) {
            console.error('Error:', error);
            // throw error;
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const updatedEvents: eventType[] = [];
                const res = await getAllEvents();
                console.log(res)
                for(const eachEvent of res){
                    const items = await getDonationEventItems(eachEvent.id);
                    // console.log(items);
                    const updatedEvent = { ...eachEvent, items };
                    console.log(updatedEvent);
                    updatedEvents.push(updatedEvent);
                }
                console.log(updatedEvents)
                setEvents(updatedEvents);
            } catch (error) {
                console.error('Error:', error);
                setErrorFetchingEvents(true);
            }
        }
        fetchData();

        const fetchEventTypesData = async () => {
            try {
                const res = await getAllEventTypes();
                console.log(res)
                setEventTypes(res);
            } catch (error) {
                console.error('Error:', error);
                // throw error;
            }
        }
        fetchEventTypesData();
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

            <Box sx={{marginBottom: 2}}>
                {eventTypes.map((eventType: any) => (
                    <Chip 
                        key={eventType.id}
                        label={eventType.name} 
                        sx={{marginRight: 1, marginBottom: 1}}/>
                ))}
            </Box>

            <Grid container spacing={3}>
                {events.map((event: eventType) => (
                    <Grid item sx={{marginBottom: 2}} key={event.id}>
                        <DonationEventCard
                            name={event.name}
                            description={`Take part in this donation by donating ${event.items.map(eachItem => eachItem.item.name).join(", ")}!`}
                            imgSrc={event.imageId}
                            numJoined={8}
                            numHoursLeft={8}
                        />
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}