// myrun-backend/src/index.js
const express = require("express");
const cors = require("cors");
const runsRouter = require("./routes/runs");
const authRouter = require("./routes/auth");
const coursesRouter = require("./routes/courses");
const navRouter = require("./routes/nav"); // ✅ 추가

const app = express();

app.use(cors());
app.use(express.json());

// 인증
app.use("/api/auth", authRouter);

// 러닝 기록
app.use("/api/runs", runsRouter);

// 코스 추천
app.use("/api/courses", coursesRouter);

// ✅ 길찾기(경로) API
app.use("/api/nav", navRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`MyRun backend listening on port ${PORT}`);
});
