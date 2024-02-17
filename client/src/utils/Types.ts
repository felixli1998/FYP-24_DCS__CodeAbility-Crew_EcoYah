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
  minQty: number;
  targetQty: number;
  pointsPerUnit: number;
  currentQty: number | null;
  item: Item;
};

export type FormDataType = {
  name: string;
  imageId: string;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  donationEventItems: DonationEventItems[];
  createdBy: number;
};
