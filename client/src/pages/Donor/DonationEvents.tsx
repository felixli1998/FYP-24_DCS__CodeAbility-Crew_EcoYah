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
    unit: string,
    eventType: {id: number}
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
    const [eventOfTheWeek, setEventOfTheWeek] = useState<eventType>();
    const [errorFetchingEvents, setErrorFetchingEvents] = useState(false);

    const [eventTypes, setEventTypes] = useState([]);
    const [filters, setFilters] = useState<number[]>([]);
    // const [filteredEvents, setFilteredEvents] = useState<eventType[]>([]);

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

    const handleFilterClick = (eventTypeId: number) => {
        console.log(events)
        console.log(eventTypeId);
        if(filters.includes(eventTypeId)){
            setFilters(filters.filter(filter => filter !== eventTypeId));
        } else {
            setFilters([...filters, eventTypeId]);
        }
          
    };

    const filteredEvents = useMemo(() => {
        if(filters.length === 0) return events;
        console.log("filters:" + filters)

        return events.filter((event: eventType) => {
            return event.donationEventItems.some((eachItem: donationEventItemsType) => {
                console.log(eachItem);
                console.log(eachItem.item.eventType.id);
                return filters.includes(eachItem.item.eventType.id);
            });
        });
    }, [filters, events]);


    const searchEvents = useMemo(() => {
        if(!search || search.trim() === '') return filteredEvents;

        return filteredEvents.filter((event: eventType) => {
            // Return events where search is in event name or items names
            return event.name.toLowerCase().includes(search.toLowerCase()) || event.donationEventItems.some((eachItem: donationEventItemsType) => {
                return eachItem.item.name.toLowerCase().includes(search.toLowerCase());
            })
        })
    }, [search, filteredEvents]);

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
        // console.log(calculateTimeLeft('2024-02-24 11:59:59 PM'))

        // const removeEventOfWeekFromEvents = async() => {

        // }
        
        const fetchData = async () => {
            try {
                const updatedEvents: eventType[] = [];
                const res = await getAllEvents();

                var maxNumDonors = 0;
                var maxNumDonorsIndex = 0;
                const currDay = new Date().getDay(); // ** Sunday - Saturday: 0 - 6 **
                // console.log("currDay: "+ currDay)
                res.forEach(async (eachEvent: eventType, index: number) => {
                    const donationEventItems = await getDonationEventItems(eachEvent.id);

                    // Used split('T')[0] as a workaround instead of extracting only Date() from database as I do not want to change the API written
                    const timeLeft = calculateTimeLeft(eachEvent.endDate.split('T')[0] + ' 11:59:59 PM');

                    const numDonors = await getDonationReqCount(eachEvent.id);
                    // console.log(eachEvent.id + " numDonors: " + numDonors);
                    // console.log("timeLeft: " + timeLeft);
                    // console.log("day of endDate: " + new Date(eachEvent.endDate).getDay());

                    const updatedEvent = { ...eachEvent, donationEventItems, timeLeft, numDonors};
                    updatedEvents.push(updatedEvent);
                    
                    // console.log("maxNumDonors: " + maxNumDonors)
                    // console.log(numDonors > maxNumDonors)
                    // console.log(timeLeft.includes('Hours'))
                    // console.log(parseInt(timeLeft.split(' ')[0]) < 7)
                    // console.log(new Date(eachEvent.endDate).getDay() >= currDay)
                    if(numDonors > maxNumDonors && (timeLeft.includes('Hours') || parseInt(timeLeft.split(' ')[0]) < 7) && new Date(eachEvent.endDate).getDay() >= currDay){
                        maxNumDonors = numDonors;
                        maxNumDonorsIndex = index;
                        // console.log("maxNumDonorsIndex: " + maxNumDonorsIndex)
                        setEventOfTheWeek(updatedEvent);
                    }
                    
                    setEvents(updatedEvents);
                });
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
                    name={eventOfTheWeek?.name || 'No Donation Event of The Week'}
                    description={`Take part in this donation by donating ${eventOfTheWeek?.donationEventItems.map(eachItem => eachItem.item.name.toLowerCase()).join(", ")}!`}
                    imgSrc={eventOfTheWeek?.imageId || 'https://picsum.photos/200/300'}
                    numJoined={eventOfTheWeek?.numDonors || 0}
                    numHoursLeft={eventOfTheWeek?.timeLeft || '0 Hours'}
                />
                
                <Typography variant='h6' sx={{fontWeight: 'bold', marginY: 2}}>Donation Categories</Typography>

                <Box sx={{marginBottom: 2}}>
                    {eventTypes.map((eventType: any) => (
                        <Chip 
                            key={eventType.id}
                            label={eventType.name} 
                            sx={{marginRight: 1, marginBottom: 1}}
                            variant="outlined"
                            onClick={() => handleFilterClick(eventType.id)}
                        />
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