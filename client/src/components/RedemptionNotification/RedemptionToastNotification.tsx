//@ts-nocheck
import React, { useEffect, useState } from 'react';
import { Button} from '@mui/material';

const RedemptionToastNotification = (props) => {
    console.log("Hi look here", props)
    const data = props.toastProps.data;
    const handleCancel = () => {
        props.closeToast();
        console.log("Refund back the cashback points to the user!")
    };

    return (
        <div style={notificationStyle}>
            <div style={{ marginBottom: '10px' }}>
                <strong>Cashback Redemption!</strong>
            </div>
            <div style={{ marginBottom: '10px' }}>
                User {data.id} redeemed {data.points} points.
            </div>

            <Button 
                onClick={handleCancel} 
                variant="contained" 
                color="secondary" 
                size="large"
            >
                Reject
            </Button>
        </div>
    );
};

// Define the style object
const notificationStyle = {
    fontSize: '50px',
    padding: '10px',
    minHeight: '33vh', // Set the minimum height here
    color: 'white',
    backgroundColor: 'green'
};

export default RedemptionToastNotification;
