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
};

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

export type SpeechSynthesisUtteranceType = {
  text: string;
  volume?: number;
  rate?: number;
  pitch?: number;
  lang?: string;
};

export type SpeechSynthesisType = {
  speak(utterance: SpeechSynthesisUtteranceType): void;
  pause(): void;
  resume(): void;
  cancel(): void;
  getVoices(): SpeechSynthesisVoice[];
  addEventListener(type: string, listener: EventListener): void;
  removeEventListener(type: string, listener: EventListener): void;
};

export type UserType = {
  id: number;
  name: String;
  contactNum: String;
  email: String;
  points: number;
  role: String;
  imageId: String;
};
