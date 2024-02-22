// Update your TypeORM configuration
import { DataSource } from 'typeorm';

// Entities
import { User } from '../entities/User';
import { DonationEvent } from '../entities/DonationEvent';
import { EventType } from '../entities/EventType';
import { Item } from '../entities/Item';
import { DonationEventItem } from '../entities/DonationEventItem';
import { DonationRequest } from '../entities/DonationRequest';

// External imports
import dotenv from 'dotenv';
import { DonationRequestItem } from '../entities/DonationRequestItem';
import { UserPoints } from '../entities/UserPoints';

dotenv.config();
const DATABASE_USERNAME = process.env.DATABASE_USERNAME || 'postgres';
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '0000';
const SnakeNamingStrategy =
  require('typeorm-naming-strategies').SnakeNamingStrategy;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  namingStrategy: new SnakeNamingStrategy(),
  username: DATABASE_USERNAME,
  password: DATABASE_PASSWORD,
  database: 'ecoyahdb',
  entities: [
    User,
    DonationEvent,
    EventType,
    Item,
    DonationEventItem,
    DonationRequest,
    DonationRequestItem,
    UserPoints
  ],
  synchronize: true,
  logging: true,
  subscribers: [],
  migrations: [],
  cache: true,
});
