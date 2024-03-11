// Update your TypeORM configuration
import { DataSource } from "typeorm";

// Entities
import { User } from "../entities/User";
import { UserPoints } from "../entities/UserPoints";
import { EventType } from "../entities/EventType";
import { Item } from "../entities/Item";
import { DonationEvent } from "../entities/DonationEvent";
import { DonationEventItem } from "../entities/DonationEventItem";
import { DonationRequest } from "../entities/DonationRequest";
import { DonationRequestItem } from "../entities/DonationRequestItem";
import { TransactionHistory } from "../entities/TransactionHistory";

// Subscribers
import { DonationRequestSubscriber } from '../subscriber/DonationRequest';
import { UserSubscriber } from '../subscriber/UserSubscriber';

// External imports
import dotenv from "dotenv";

dotenv.config();
const DATABASE_USER = process.env.DATABASE_USER || "postgres";
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || "0000";
const DATABASE_HOST = process.env.DATABASE_HOST || "localhost";
const SnakeNamingStrategy =
  require("typeorm-naming-strategies").SnakeNamingStrategy;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DATABASE_HOST,
  port: 5432,
  namingStrategy: new SnakeNamingStrategy(),
  username: DATABASE_USER,
  password: DATABASE_PASSWORD,
  database: "ecoyahdb",
  entities: [
    User,
    UserPoints,
    EventType,
    Item,
    DonationEvent,
    DonationEventItem,
    DonationRequest,
    DonationRequestItem,
    TransactionHistory
  ],
  synchronize: true,
  logging: true,
  subscribers: [DonationRequestSubscriber, UserSubscriber],
  migrations: [],
  cache: true,
});
