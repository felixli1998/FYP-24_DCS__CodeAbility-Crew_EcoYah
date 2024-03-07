export type DonationEvent = {
  id: number;
  name: string;
  imageId: string;
  startDate: string;
  endDate: string;
  donationEventItems: DonationEventItem[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type EventType = {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type Item = {
  id: number;
  name: string;
  unit: string;
  eventType: EventType;
  createdAt: string;
  updatedAt: string;
};

export type DonationEventItemCreation = {
  minQty: number;
  targetQty: number;
  currentQty: number;
  pointsPerUnit: number;
  item: Item;
};

export type DonationEventItem = DonationEventItemCreation & { id: number };

export type FormDataType = {
  name: string;
  imageId: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  donationEventItems: DonationEventItem[];
  createdBy: number;
};

export type DonationRequestType = {
  id: number;
  user: { name: string };
  donationEvent: {
    id: number;
    name: string;
  };
  status: string;
  dropOffDate: string;
  dropOffTime: string;
  donationRequestItems: DonationRequestItemsType[];
};

export type DonationRequestItemsType = {
  id: number;
  quantity: number;
  donationEventItem: {
    id: number;
    item: {
      id: number;
      name: string;
      unit: string;
    };
    pointsPerUnit: number;
  };
};
