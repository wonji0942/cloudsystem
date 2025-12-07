// myrun-backend/src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth");
const runsRoutes = require("./routes/runs");
const coursesRoutes = require("./routes/courses");

const app = express();
const PORT = process.env.PORT || 4000;

// 🔹 CORS 설정 - 프론트 포트(3000, 5173 둘 다) 허용
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  })
);

// 바디 파서
app.use(express.json());
app.use(cookieParser());

// 라우터
app.use("/api/auth", authRoutes);
app.use("/api/runs", runsRoutes);
app.use("/api/courses", coursesRoutes);

// 헬스체크
app.get("/", (req, res) => {
  res.send("MyRun backend OK");
});

app.listen(PORT, () => {
  console.log(`MyRun backend listening on port ${PORT}`);
});
