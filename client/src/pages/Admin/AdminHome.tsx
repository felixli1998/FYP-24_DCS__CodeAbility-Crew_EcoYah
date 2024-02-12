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

  const handleDonationEventClick = (donationEvent: any) => {
    let formData: any = {
      id: donationEvent.id,
      name: donationEvent.name,
      imageId: donationEvent.imageId,
      eventType: donationEvent.eventType,
      startDate: donationEvent.startDate,
      endDate: donationEvent.endDate,
      isActive: donationEvent.isActive,
      createdBy: donationEvent.createdBy,
    };

    formData.donationEventItems = donationEvent.donationEventItems.map(
      (item: any) => ({
        id: item.id,
        name: item.item.name,
        minQty: item.minQty,
        targetQty: item.targetQty,
        pointsPerUnit: item.pointsPerUnit,
        currentQty: item.currentQty,
        unit: item.item.unit,
      })
    );

    formData.selectedItems = donationEvent.donationEventItems.map(
      (item: any) => item.item
    );

    navigate('/admin/donation-event-edit', {
      state: JSON.stringify({
        formData,
        isPreview: false,
      }),
    });
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
            onClick={() => handleDonationEventClick(donationEvent)}
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
