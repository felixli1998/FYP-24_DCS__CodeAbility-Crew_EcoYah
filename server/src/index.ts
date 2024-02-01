// External Imports
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

// Internal Imports
import generateSeedData from "../seeds/seed";

// For TypeORM
import "reflect-metadata";
import { AppDataSource } from "./config/data-source";

// Routes
import baseRoutes from './routes/baseRoutes';
import userRoutes from './routes/userRoutes';
import imageRoutes from './routes/imageRoutes';
import donationEventRoutes from './routes/donationEventRoutes';
import itemRoutes from './routes/itemRoutes';
import eventRoutes from './routes/eventTypeRoutes';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT;

const runSeedFile = ():boolean => {
  // By default, it will not run the seed file unless you specify it in the .env file
  const seedFileConfig = process.env.RUN_SEED_FILE || "false";

  // Prematurely return false if it is on production //
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  return seedFileConfig === "true";
}

// Database
AppDataSource.initialize()
    .then(() => {
      if(runSeedFile()) generateSeedData()
    })
    .catch((error) => console.log(error))


// Routes
app.use('/', baseRoutes);
app.use('/users', userRoutes);
app.use('/images', imageRoutes);
app.use('/donation-events', donationEventRoutes);
app.use('/items', itemRoutes);
app.use('/eventTypes', eventRoutes)

app.get('/', (req, res) => {
  res.send('Hello World!');
});

// testing
const project = "EcoYah";

app.post('/test', (req, res) => {
  if (req.body.msg === 'start project') {
    res.send({ project: project, status: 'online' });
  } else if (req.body.msg === 'pause project') {
    res.send({ project: project, status: 'offline' });
  } else {
    res.status(404).send('Error!');
  }
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});