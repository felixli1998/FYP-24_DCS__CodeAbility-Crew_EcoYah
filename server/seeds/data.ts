import { UserRole } from "../src/entities/User";

type UserSeedDataT = {
  name: string;
  email: string;
  passwordInput: string;
  contactNum: string;
  imageURL: string;
  role: UserRole;
};

export const USER_SEED_DATA: UserSeedDataT[] = [
  {
    name: 'Michael Jackson',
    email: 'michaeljackson1@gmail.com',
    passwordInput: 'Testpassw0rd!',
    contactNum: '+6512345678',
    imageURL: 'https://picsum.photos/200/300',
    role: UserRole.DONOR
  },
  {
    name: 'Alex',
    email: 'alex@test.com',
    passwordInput: '1234',
    contactNum: '+6512345678',
    imageURL: 'https://picsum.photos/200/300',
    role: UserRole.STAFF
  },
  {
    name: 'Siu Mei',
    email: 'siumei@test.com',
    passwordInput: '1234',
    contactNum: '+6512345678',
    imageURL: 'https://picsum.photos/200/300',
    role: UserRole.STAFF
  },
  {
    name: 'Aaron',
    email: 'aaron@test.com',
    passwordInput: '1234',
    contactNum: '+6512345678',
    imageURL: 'https://picsum.photos/200/300',
    role: UserRole.ADMIN
  }
]

export const EVENT_TYPE_SEED_DATA = [
  {
    name: "Electronic Waste"
  },
  {
    name: "Food Waste"
  },
  {
    name: "Book Donation"
  },
  {
    name: "Clothing Waste"
  },
]

export const ITEM_SEED_DATA = [
  {
    name: "Laptop",
    unit: "unit",
    eventType: "Electronic Waste"
  },
  {
    name: "Bok Choy",
    unit: "gram",
    eventType: "Food Waste"
  },
  {
    name: "Bread",
    unit: "slice",
    eventType: "Food Waste"
  },
  {
    name: "Mobile Phone",
    unit: "unit",
    eventType: "Electronic Waste"
  },
  {
    name: "Children's Books",
    unit: "unit",
    eventType: "Book Donation"
  },
  {
    name: "Young Adult Fiction",
    unit: "unit",
    eventType: "Book Donation"
  },
  {
    name: "Adult Fiction",
    unit: "unit",
    eventType: "Book Donation"
  },
  {
    name: "Children's Clothing",
    unit: "unit",
    eventType: "Clothing Donation"
  },
  {
    name: "Young Adult Clothing",
    unit: "unit",
    eventType: "Clothing Donation"
  },
]

export const DONATION_EVENT_SEED_DATA = [
  {
    name: "Do good with food",
    imageId: "https://picsum.photos/200/300",
    user: "Siu Mei",
    eventType: "Food Waste",
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-01-30"),
    donationEventItems: [
      {
        name: "Bok Choy",
        targetQty: 100000, // 100000g = 100kg
        minQty: 500,
        pointsPerUnit: 50
      },
      {
        name: "Bread",
        targetQty: 1000,
        minQty: 10,
        pointsPerUnit: 5
      }
    ]
  },
  {
    name: "Do good with electronics",
    imageId: "https://picsum.photos/200/300",
    user: "Aaron",
    eventType: "Electronic Waste",
    startDate: new Date("2024-02-02"),
    endDate: new Date("2024-02-30"),
    donationEventItems: [
      {
        name: "Laptop",
        targetQty: 10,
        minQty: 1,
        pointsPerUnit: 1000
      },
      {
        name: "Mobile Phone",
        targetQty: 10,
        minQty: 1,
        pointsPerUnit: 500
      }
    ]
  },
  {
    name: "Book Driver123",
    imageId: "https://picsum.photos/200/300",
    user: "Michael Jackson",
    eventType: "Book Donation",
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-03-30"),
    donationEventItems: [
      {
        name: "Children's Books",
        targetQty: 500,
        minQty: 10,
        pointsPerUnit: 20
      },
      {
        name: "Young Adult Fiction",
        targetQty: 300,
        minQty: 5,
        pointsPerUnit: 30
      }
    ]
  },
  {
    name: "Book Drive456",
    imageId: "https://picsum.photos/200/300",
    user: "Michael Jackson",
    eventType: "Book Donation",
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-03-30"),
    donationEventItems: [
      {
        name: "Children's Books",
        targetQty: 500,
        minQty: 10,
        pointsPerUnit: 20
      },
      {
        name: "Young Adult Fiction",
        targetQty: 300,
        minQty: 5,
        pointsPerUnit: 30
      }
    ]
  },
]