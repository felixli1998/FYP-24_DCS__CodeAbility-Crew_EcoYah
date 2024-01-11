import dotenv from "dotenv";
import express from "express";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT;

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
