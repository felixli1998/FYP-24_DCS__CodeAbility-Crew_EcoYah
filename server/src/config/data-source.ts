// Update your TypeORM configuration
import { DataSource } from 'typeorm';

// Entities
// import { Item } from "../entities/Item";
import { User } from '../entities/User';
import { DonationEvent } from '../entities/DonationEvent';
import { EventType } from '../entities/EventType';
import { Item } from '../entities/Item';

// External imports
import dotenv from 'dotenv';
import { DonationEventItem } from '../entities/DonationEventItem';

dotenv.config();
const DATABASE_USERNAME = process.env.DATABASE_USERNAME || 'postgres';
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || '';
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
  entities: [User, DonationEvent, EventType, Item, DonationEventItem],
  synchronize: true,
  logging: true,
  subscribers: [],
  migrations: [],
});
