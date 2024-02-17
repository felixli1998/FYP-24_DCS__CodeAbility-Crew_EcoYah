import { useState, useEffect, useMemo } from "react";
import DonationEventCard from "../../components/DonationEvent/DonationEventCard";
import { fetchActiveDonationEvents } from '../../services/donationEventApi';
import { fetchEventTypes } from '../../services/eventTypesApi';
import { getDonationEventItemsByDonationId } from '../../services/donationEventItemApi';
import { retrieveDonationReqCountByEventId } from '../../services/donationRequestApi';
import SearchIcon from '@mui/icons-material/Search';

import {
    Box,
    Chip,
    Container,
    Grid,
    InputAdornment,
    TextField,
    Typography
  } from '@mui/material';

type itemType = {
    id: number,
    name: string,
    unit: string
}

type donationEventItemsType = {
    id: number,
    item: itemType,
    minQty: number,
    pointsPerUnit: number
}

type eventType = {
    id: number,
    donationEventItems: donationEventItemsType[],
    startDate: string,
    endDate: string,
    timeLeft: string,
    numDonors: number,
    imageId: string,
    isActive: boolean,
    name: string,
    createdAt: string,
    updatedAt: string
}

export default function DonationEvents() {
    const [search, setSearch] = useState('');
    const [events, setEvents] = useState<eventType[]>([]);
    const [errorFetchingEvents, setErrorFetchingEvents] = useState(false);

    const [eventTypes, setEventTypes] = useState([]);

    const getAllEvents = async () => {
        try {
            const response = await fetchActiveDonationEvents("");
            return response.data;
        } catch (error) {
            console.error('Error:', error);
            setErrorFetchingEvents(true);
        }
    }

    const getAllEventTypes = async () => {
        try {
            const response = await fetchEventTypes();
            return response.data.eventTypes;
        } catch (error) {
            console.error('Error:', error);
            // throw error;
        }
    }

    const getDonationEventItems = async (donationEventId: number) => {
        try {
            const res = await getDonationEventItemsByDonationId(donationEventId);
            return res.data.donationEventItems;
        } catch (error) {
            console.error('Error:', error);
            // throw error;
        }
    }

    const getDonationReqCount = async (donationEventId: number) => {
        try {
            const res = await retrieveDonationReqCountByEventId(donationEventId);
            return res.data;
        } catch (error) {
            console.error('Error:', error);
            // throw error;
        }
    }

    const searchEvents = useMemo(() => {
        if(!search || search.trim() === '') return events;

        return events.filter((event: eventType) => {
            // Return events where search is in event name or items names
            return event.name.toLowerCase().includes(search.toLowerCase()) || event.donationEventItems.some((eachItem: donationEventItemsType) => {
                return eachItem.item.name.toLowerCase().includes(search.toLowerCase());
            })
        })
    }, [search, events]);

    const calculateTimeLeft = (endDate: string) => {
        const endDateInMs = new Date(endDate).getTime();
        const currentDateInSGT = new Date().toLocaleString('en-US', { timeZone: 'Asia/Singapore' });
        const currentDateInMs = new Date(currentDateInSGT).getTime();
        const timeLeftInHours = Math.floor((endDateInMs - currentDateInMs) / (1000 * 60 * 60));
        
        if(timeLeftInHours < 24){
            return timeLeftInHours + ' Hours';
        } else {
            return Math.floor(timeLeftInHours / 24) + ' Days';
        }
    }

    useEffect(() => {
        calculateTimeLeft('2024-02-17 11:59:59 PM')
        const fetchData = async () => {
            try {
                const updatedEvents: eventType[] = [];
                const res = await getAllEvents();
                for(const eachEvent of res){
                    const donationEventItems = await getDonationEventItems(eachEvent.id);

                    // Used split('T')[0] as a workaround instead of extracting only Date() from database as I do not want to change the API written
                    const timeLeft = calculateTimeLeft(eachEvent.endDate.split('T')[0] + ' 11:59:59 PM');

                    const numDonors = await getDonationReqCount(eachEvent.id);
                    console.log(eachEvent.id + ": " + numDonors);

                    const updatedEvent = { ...eachEvent, donationEventItems, timeLeft, numDonors};
                    updatedEvents.push(updatedEvent);
                }
                setEvents(updatedEvents);
            } catch (error) {
                console.error('Error:', error);
                setErrorFetchingEvents(true);
            }
        }
        fetchData();

        // *** For Filtering ***
        const fetchEventTypesData = async () => {
            try {
                const res = await getAllEventTypes();
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
            {errorFetchingEvents ? 
                <Typography variant='h5' sx={{fontWeight: 'bold', marginTop: 3}}>Error fetching events, please try again later, sorry for the inconvenience!</Typography> 
                    : 

            <>
                <TextField fullWidth variant="outlined" 
                    id="searchBar" 
                    color="success"
                    sx={{marginBottom: 2}}
                    placeholder="Search e.g. Cabbage, Bread" 
                    InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <SearchIcon />
                          </InputAdornment>
                        ),
                      }}
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                />

                <Typography variant='h5' sx={{fontWeight: 'bold', marginBottom: 2}}>Donation of the Week</Typography>
                
                <DonationEventCard
                    name='Example'
                    description='This is an example description'
                    imgSrc="https://picsum.photos/200/300"
                    numJoined={8}
                    numHoursLeft={'8 Hours'}
                />
                
                <Typography variant='h6' sx={{fontWeight: 'bold', marginY: 2}}>Donation Categories</Typography>

                <Box sx={{marginBottom: 2}}>
                    {eventTypes.map((eventType: any) => (
                        <Chip 
                            key={eventType.id}
                            label={eventType.name} 
                            sx={{marginRight: 1, marginBottom: 1}}/>
                    ))}
                </Box>

                <Grid container spacing={3}>
                    {searchEvents.map((event: eventType) => (
                        <Grid item sx={{marginBottom: 2}} key={event.id}>
                            <DonationEventCard
                                name={event.name}
                                description={`Take part in this donation by donating ${event.donationEventItems.map(eachItem => eachItem.item.name.toLowerCase()).join(", ")}!`}
                                imgSrc={event.imageId}
                                numJoined={event.numDonors}
                                numHoursLeft={event.timeLeft}
                            />
                        </Grid>
                    ))}
                </Grid>
            </>
         }
        </Container>
    );
}