// myrun-backend/src/index.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/auth");
const runRoutes = require("./routes/runs");
const courseRoutes = require("./routes/courses");

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("MyRun backend running");
});

app.use("/api/auth", authRoutes);
app.use("/api/runs", runRoutes);
app.use("/api/courses", courseRoutes);

app.listen(port, () => {
  console.log(`MyRun backend listening on port ${port}`);
});
