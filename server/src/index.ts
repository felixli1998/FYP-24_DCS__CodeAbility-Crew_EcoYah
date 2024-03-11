// External Imports
import dotenv from "dotenv";
import express, { Router, Request, Response } from "express";
import cors from "cors";
import { createServer } from "http";
import { Server, Socket } from "socket.io";


// Internal Imports
import generateSeedData from "../seeds/seed";

// For TypeORM
import "reflect-metadata";
import { AppDataSource } from "./config/data-source";

// Routes
import baseRoutes from "./routes/baseRoutes";
import userRoutes from "./routes/userRoutes";
import imageRoutes from "./routes/imageRoutes";
import donationEventRoutes from "./routes/donationEventRoutes";
import itemRoutes from "./routes/itemRoutes";
import eventRoutes from "./routes/eventTypeRoutes";
import donationRequestRoutes from "./routes/donationRequestRoutes";
import donationRequestItemRoutes from "./routes/donationRequestItemRoutes";
import donationEventItemRoutes from "./routes/donationEventItemRoutes";
import longPollingRoute, {handleLongPolling} from "./routes/longPolling";
import dashboardRoutes from "./routes/dashboardRoutes";


dotenv.config();

const app = express();
const httpServer = createServer(app);
const options = { 
  pingTimeout: 5000,
  pingInterval: 10000,
  cors:{
    origin: "*"
  }
};
const io = new Server(httpServer, options);
handleLongPolling(io);
app.use(express.json({ limit: "50mb" }));
app.use(cors());

const port = process.env.PORT;

const runSeedFile = (): boolean => {
  // By default, it will not run the seed file unless you specify it in the .env file
  const seedFileConfig = process.env.RUN_SEED_FILE || "false";

  // Prematurely return false if it is on production //
  if (process.env.NODE_ENV === "production") {
    return false;
  }

  return seedFileConfig === "true";
};

// Database
AppDataSource.initialize()
  .then(() => {
    if (runSeedFile()) generateSeedData();
  })
  .catch((error) => console.log(error));

// Routes
app.use("/", baseRoutes);
app.use("/users", userRoutes);
app.use("/images", imageRoutes);
app.use("/donation-events", donationEventRoutes);
app.use("/donation-event-item", donationEventItemRoutes);
app.use("/items", itemRoutes);
app.use("/event-types", eventRoutes);
app.use("/donation-requests", donationRequestRoutes);
app.use("/donation-request-items", donationRequestItemRoutes);
app.use("/longpolling", longPollingRoute);
app.use("/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// testing
const project = "EcoYah";

app.post("/test", (req, res) => {
  if (req.body.msg === "start project") {
    res.send({ project: project, status: "online" });
  } else if (req.body.msg === "pause project") {
    res.send({ project: project, status: "offline" });
  } else {
    res.status(404).send("Error!");
  }
});

httpServer.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
