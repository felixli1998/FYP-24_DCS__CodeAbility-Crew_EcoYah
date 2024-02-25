import { UserRole } from "../src/entities/User";

type UserSeedDataT = {
  name: string;
  email: string;
  passwordInput: string;
  contactNum: string;
  imageURL: string;
  role: UserRole;
};

export const ADMIN_SEED_DATA: UserSeedDataT[] = [
  {
    name: 'Lay Hoon',
    email: 'layhoon@test.com',
    passwordInput: '1234',
    contactNum: '+6512345678',
    imageURL: 'https://picsum.photos/200/300',
    role: UserRole.STAFF
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
    name: "iPhone 12",
    unit: "unit",
    eventType: "Electronic Waste"
  },
  {
    name: "Bok Choy",
    unit: "gram",
    eventType: "Food Waste"
  },
  {
    name: "Eggs",
    unit: "unit",
    eventType: "Food Waste"
  },
  {
    name: "Rice",
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
    name: "Old Newspaper",
    unit: "unit",
    eventType: "Book Donation"
  },
  {
    name: "Old Magazines",
    unit: "unit",
    eventType: "Book Donation"
  },
  {
    name: "Old Books",
    unit: "unit",
    eventType: "Book Donation"
  },
  {
    name: "Children's Clothing",
    unit: "unit",
    eventType: "Clothing Waste"
  },
  {
    name: "Young Adult Clothing",
    unit: "unit",
    eventType: "Clothing Waste"
  }
]

export const DONATION_EVENT_SEED_DATA = [
  {
    name: "Harvest for Hope: Food Donation Drive",
    imageId: "https://www.shutterstock.com/image-photo/concept-food-needs-shortages-free-260nw-1546483745.jpg",
    user: "Siu Mei",
    eventType: "Food Waste",
    startDate: new Date("2024-02-25"),
    endDate: new Date("2024-03-25"),
    donationEventItems: [
      {
        name: "Bok Choy",
        targetQty: 100000,
        minQty: 500,
        pointsPerUnit: 5
      },
      {
        name: "Bread",
        targetQty: 1000,
        minQty: 10,
        pointsPerUnit: 5
      },
      {
        name: "Rice",
        targetQty: 100000,
        minQty: 500,
        pointsPerUnit: 15
      },
      {
        name: "Eggs",
        targetQty: 1000,
        minQty: 10,
        pointsPerUnit: 5
      }
    ]
  },
  {
    name: "Do good with electronics",
    imageId: "https://www.shutterstock.com/image-photo/book-260nw-732217162.jpg",
    user: "Aaron",
    eventType: "Book Donation",
    startDate: new Date("2024-02-01"),
    endDate: new Date("2024-04-30"),
    donationEventItems: [
      {
        name: "Laptop",
        targetQty: 10,
        minQty: 1,
        pointsPerUnit: 1500
      },
      {
        name: "iPhone 12",
        targetQty: 15,
        minQty: 1,
        pointsPerUnit: 5000
      }
    ]
  },
  {
    name: "Reshelf and Reuse: Book Recycling Initiative",
    imageId: "https://picsum.photos/200/300",
    user: "Aaron",
    eventType: "Book Donation",
    startDate: new Date("2024-03-01"),
    endDate: new Date("2024-03-30"),
    donationEventItems: [
      {
        name: "Old Newspaper",
        targetQty: 500,
        minQty: 10,
        pointsPerUnit: 20
      },
      {
        name: "Old Books",
        targetQty: 300,
        minQty: 5,
        pointsPerUnit: 30
      },
      {
        name: "Old Magazines",
        targetQty: 300,
        minQty: 5,
        pointsPerUnit: 30
      }
    ]
  },
]