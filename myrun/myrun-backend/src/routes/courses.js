// myrun-backend/src/routes/courses.js
const express = require("express");
const sampleCourses = require("../sampleCourses");

const router = express.Router();

/**
 * GET /api/courses
 * query:
 *   distance: "선택없음" | "5km 이하" | "5~10km" | "10km 이상"
 *   level: "전체" | "하" | "중" | "상"
 *   area: "선택없음" | "마포구" | "송파구" | ... (서울 25개 구)
 */
router.get("/", (req, res) => {
  const {
    distance = "선택없음",
    level = "전체",
    area = "선택없음",
  } = req.query;

  let result = [...sampleCourses];

  // 1) 거리 필터
  if (distance === "5km 이하") {
    result = result.filter((c) => c.distanceKm <= 5);
  } else if (distance === "5~10km") {
    result = result.filter((c) => c.distanceKm > 5 && c.distanceKm <= 10);
  } else if (distance === "10km 이상") {
    result = result.filter((c) => c.distanceKm > 10);
  }

  // 2) 난이도 필터 (하/중/상)
  if (["하", "중", "상"].includes(level)) {
    result = result.filter((c) => c.level === level);
  }

  // 3) 지역 필터 (구)
  if (area && area !== "선택없음") {
    result = result.filter((c) => c.area === area);
  }

  // 거리 짧은 순 정렬
  result.sort((a, b) => a.distanceKm - b.distanceKm);

  res.json(result);
});

module.exports = router;
