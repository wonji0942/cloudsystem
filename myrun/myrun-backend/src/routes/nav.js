// myrun-backend/src/routes/nav.js
const express = require("express");

const router = express.Router();

/**
 * GET /api/nav/route
 * query:
 *   startLat, startLng, endLat, endLng  (모두 WGS84 위도/경도, 숫자)
 *
 * 응답:
 *   {
 *     distanceMeters: number,
 *     durationSeconds: number,
 *     path: [{ lat, lng }, ...]
 *   }
 */
router.get("/route", async (req, res) => {
  try {
    const startLat = parseFloat(req.query.startLat);
    const startLng = parseFloat(req.query.startLng);
    const endLat = parseFloat(req.query.endLat);
    const endLng = parseFloat(req.query.endLng);

    if (
      Number.isNaN(startLat) ||
      Number.isNaN(startLng) ||
      Number.isNaN(endLat) ||
      Number.isNaN(endLng)
    ) {
      return res
        .status(400)
        .json({ message: "startLat, startLng, endLat, endLng 모두 필요합니다." });
    }

    const restKey =
      process.env.KAKAO_MOBILITY_REST_API_KEY ||
      process.env.KAKAO_NAV_REST_API_KEY;

    if (!restKey) {
      console.error("KAKAO_MOBILITY_REST_API_KEY 환경변수가 없습니다.");
      return res
        .status(500)
        .json({ message: "서버 설정 오류(Kakao REST 키 없음)" });
    }

    // Kakao Mobility 자동차 길찾기 API 호출 
    const origin = `${startLng},${startLat}`; // X=경도, Y=위도
    const destination = `${endLng},${endLat}`;

    const params = new URLSearchParams({
      origin,
      destination,
      priority: "DISTANCE", // 최단거리 기준
      summary: "false",     // roads[].vertexes 포함한 상세 경로
    });

    const url = `https://apis-navi.kakaomobility.com/v1/directions?${params.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `KakaoAK ${restKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("Kakao directions API error:", response.status, text);
      return res
        .status(500)
        .json({ message: "카카오 길찾기 API 호출 실패", detail: text });
    }

    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      return res.status(400).json({ message: "경로를 찾을 수 없습니다." });
    }

    const route = data.routes[0];
    const summary = route.summary || {};

    const distanceMeters = summary.distance || 0; // m
    const durationSeconds = summary.duration || 0; // sec

    // sections[].roads[].vertexes 에서 폴리라인 좌표 추출 
    const path = [];
    const sections = route.sections || [];
    sections.forEach((section) => {
      const roads = section.roads || [];
      roads.forEach((road) => {
        const v = road.vertexes || [];
        for (let i = 0; i < v.length; i += 2) {
          const x = v[i];     // 경도
          const y = v[i + 1]; // 위도
          if (typeof x === "number" && typeof y === "number") {
            path.push({ lat: y, lng: x });
          }
        }
      });
    });

    if (path.length === 0) {
      return res
        .status(400)
        .json({ message: "경로 좌표가 없습니다.", distanceMeters, durationSeconds });
    }

    return res.json({
      distanceMeters,
      durationSeconds,
      path,
    });
  } catch (err) {
    console.error("nav/route error:", err);
    return res.status(500).json({ message: "서버 내부 오류" });
  }
});

module.exports = router;
