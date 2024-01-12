import dotenv from "dotenv";
import express from "express";
import cors from "cors";

// For Typeorm
import "reflect-metadata"; 
import { AppDataSource } from "./data-source";
import { User } from "./entity/User";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT;

// Database

AppDataSource.initialize()
    .then(() => {
        // here you can start to work with your database
    })
    .catch((error) => console.log(error))



// testing
const project = "EcoYah";

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/test", (req, res) => {
  if (req.body.msg === "start project") {
    res.send({ project: project, status: "online" });
  } else if (req.body.msg === "pause project") {
    res.send({ project: project, status: "offline" });
  } else {
    res.status(404).send("Error!");
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
