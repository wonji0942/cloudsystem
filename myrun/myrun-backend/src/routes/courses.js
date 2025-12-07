// myrun-backend/src/routes/courses.js
const express = require("express");
const { getRouteByPlaceNames } = require("../services/kakaoClient");
const sampleCourses = require("../data/sampleCourses");

const router = express.Router();

/**
 * 쿼리 파라미터 정규화
 *  - level   : "하" | "중" | "상" | null
 *  - area    : 구 이름 | null
 * distance 필터는 더 이상 사용하지 않음.
 */
function normalizeLevel(level) {
  if (!level || level === "any" || level === "전체" || level === "선택없음") {
    return null;
  }
  if (["하", "중", "상"].includes(level)) return level;
  return null;
}

function normalizeArea(area) {
  if (!area || area === "any" || area === "선택없음") return null;
  return area;
}

/**
 * GET /api/courses/recommend
 *
 * Query
 *  - level: "하" | "중" | "상" | "선택없음"
 *  - area : "영등포구" 등 구 이름 | "선택없음"
 *
 * Response
 *  - 성공 시:
 *    {
 *      ok: true,
 *      courses: [
 *        {
 *          id, title, area, level,
 *          distanceKm, durationMin,
 *          startName, endName,
 *          path: [{ lat, lng }, ...]
 *        },
 *        ...
 *      ]
 *    }
 *
 *  - 조건에 맞는 코스가 없으면:
 *    { ok: true, courses: [], reason: "NO_MATCH" }
 *
 *  - 길찾기 API가 전부 실패하면:
 *    { ok: false, courses: [], reason: "ROUTE_ERROR" }
 */
router.get("/recommend", async (req, res) => {
  const level = normalizeLevel(req.query.level);
  const area = normalizeArea(req.query.area);

  // 1) 메타데이터 기반 필터링 (카카오 API 호출 X)
  let candidates = sampleCourses.slice();

  if (level) {
    candidates = candidates.filter((c) => c.level === level);
  }
  if (area) {
    candidates = candidates.filter((c) => c.area === area);
  }

  if (candidates.length === 0) {
    return res.json({
      ok: true,
      courses: [],
      reason: "NO_MATCH",
    });
  }

  // 2) 각 후보에 대해 카카오 길찾기 호출
  const results = [];

  for (const course of candidates) {
    try {
      const route = await getRouteByPlaceNames(
        course.startName,
        course.endName
      );
      // route: { distanceKm, durationMin, path: [{lat,lng}, ...] }

      const distanceKm = Number(route.distanceKm.toFixed(2));
      const durationMin = Math.round(route.durationMin);

      results.push({
        id: course.id,
        title: course.title,
        area: course.area,
        level: course.level,
        distanceKm,
        durationMin,
        startName: course.startName,
        endName: course.endName,
        path: route.path,
      });
    } catch (err) {
      // 특정 코스가 실패해도 전체 API가 죽지 않도록 로그만 찍고 넘어감
      console.error("recommend course error:", err);
      continue;
    }
  }

  if (results.length === 0) {
    // 메타조건은 맞지만 길찾기 전부 실패
    return res.json({
      ok: false,
      courses: [],
      reason: "ROUTE_ERROR",
    });
  }

  return res.json({
    ok: true,
    courses: results,
  });
});

module.exports = router;
