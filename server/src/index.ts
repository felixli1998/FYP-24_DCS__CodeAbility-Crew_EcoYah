import dotenv from "dotenv";
import express from "express";
import cors from "cors";

// For Typeorm
import "reflect-metadata"; 
import { AppDataSource } from "./config/data-source";

// Routes
import itemRoutes from './routes/itemRoutes';

// For inserting sample data
import { Item } from "./entities/Item";
import { ItemRepository } from "./repositories/ItemRepository";
import { ItemService } from "./services/ItemService";


dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT;


// Database
AppDataSource.initialize()
    .then(() => {
        // TODO: Remove in future, only to add test data
        const sampleItem = new Item();
        sampleItem.name = "Test Item";
        sampleItem.createdAt = new Date();
        sampleItem.updatedAt = new Date();

        const itemRepository = new ItemRepository();
        const itemService = new ItemService(itemRepository);
        itemService.createItem(sampleItem); 
    })
    .catch((error) => console.log(error))

// testing
const project = "EcoYah";

// Routes
app.use('/', itemRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

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

