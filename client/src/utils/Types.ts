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
  createdAt: string;
  updatedAt: string;
}

export type DonationEventItems = {
  id: number;
  name: string;
  minQty: number;
  targetQty: number;
  pointsPerUnit: number;
};

export type FormDataType = {
  name: string;
  imageId: string;
  eventType: EventType | null;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  donationEventItems: DonationEventItems[];
  createdBy: number;
};

export type DonationRequestType = {
  id: number;
  user: Record<string, string>;
  status: string;
  dropOffDate: string;
  dropOffTime: string;
  donationRequestItems: DonationRequestItemsType[];
};

export type DonationRequestItemsType = {
  id: number;
  quantity: number;
  donationEventItem: Record<
    string,
    | number
    | Record<string, Record<string, string | number>>
    | Record<string, Record<string, string>>
  >;
};