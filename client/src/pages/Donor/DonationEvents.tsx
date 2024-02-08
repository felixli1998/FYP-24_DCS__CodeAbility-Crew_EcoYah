import {useState, useEffect } from "react";
import DonationEventCard from "../../components/DonationEvent/DonationEventCard";
import exampleImg from "../../assets/Reward.png";
import {
    Box,
    Container,
    Typography,
    Avatar,
    ListItemAvatar,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    IconButton
  } from '@mui/material';

export default function DonationEvents() {
    // const [events, setEvents] = useState([]);
    // const [errorFetchingEvents, setErrorFetchingEvents] = useState(false);

    // const getAllEvents = async () => {
    //     try {
    //         const response = await fetch('http://localhost:5000/api/events');
    //         const data = await response.json();
    //         return data;
    //     } catch (error) {
    //         console.error('Error:', error);
    //         throw error;
    //     }
    // }

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const res = await getAllEvents();
    //             setEvents(res);
    //         } catch (error) {
    //             console.error('Error:', error);
    //             setErrorFetchingEvents(true);
    //         }
    //     }
    //     fetchData();
    // }, []);

    return (
        <Box sx={{marginTop: 3, marginX: 3}}>
            <Typography variant='h5' sx={{fontWeight: 'bold', marginBottom: 2}}>Donation of the Week</Typography>
            
            <DonationEventCard
                name='Example'
                description='This is an example description'
                imgSrc="https://picsum.photos/200/300"
                numJoined={8}
                numHoursLeft={8}
            />
            <Typography sx={{fontWeight: 'bold', marginY: 2}}>Donation Categories</Typography>
        </Box>
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