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

dotenv.config();
const DATABASE_USER = process.env.DATABASE_USER || 'postgres';
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '';
const DATABASE_HOST = process.env.DATABASE_HOST || 'localhost';
const SnakeNamingStrategy =
  require('typeorm-naming-strategies').SnakeNamingStrategy;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: DATABASE_HOST,
  port: 5432,
  namingStrategy: new SnakeNamingStrategy(),
  username: DATABASE_USER,
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
  ],
  synchronize: true,
  logging: true,
  subscribers: [],
  migrations: [],
  cache: true,
});
