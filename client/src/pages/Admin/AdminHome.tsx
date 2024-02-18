import { useQuery } from '@tanstack/react-query';
import React, { useEffect } from 'react';
import { getDonationEvents } from '../../services/donationEventApi';
import { useNavigate } from 'react-router-dom';
import { DonationEventItems } from '../../utils/Types';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const {
    data: donationEventsData,
    isLoading,
    isError,
    refetch: donationEventsRefetch,
  } = useQuery({
    queryKey: ['donation-events'],
    queryFn: getDonationEvents,
  });

  const handleDonationEventClick = (donationEventId: number) => {
    navigate(`/admin/donation-event/${donationEventId}`)
  };

  return (
    <div>
      <h1>Welcome to the admin landing page</h1>
      <p>Admin needs to be authenticated in order to enter this page</p>
      {isLoading ? (
        <p>Loading...</p>
      ) : isError ? (
        <p>Error fetching data</p>
      ) : donationEventsData && donationEventsData.length > 0 ? (
        donationEventsData.map((donationEvent: any) => (
          <button
            key={donationEvent.id}
            onClick={() => handleDonationEventClick(donationEvent.id)}
          >
            {donationEvent.name}
          </button>
        ))
      ) : (
        <p>No donation events available</p>
      )}
    </div>
  );
};

export default Home;
