// myrun-backend/src/routes/runs.js
const express = require("express");
const pool = require("../db");
const { buildStatsFromRuns } = require("../utils/stats");
const auth = require("../middleware/auth");

const router = express.Router();

// 🔐 이하 모든 러닝 API는 로그인 필수
router.use(auth);

// POST /api/runs  - 러닝 기록 저장 (경로 포함)
router.post("/", async (req, res) => {
  try {
    const userId = req.user.id;

    const {
      runDate,
      distanceKm,
      durationMin,
      courseName,
      memo,
      calories,
      avgSpeedKmh,
      startLat,
      startLng,
      endLat,
      endLng,
      path, // [{lat, lng}, ...] 형식
    } = req.body;

    if (
      !runDate ||
      !distanceKm ||
      !durationMin ||
      startLat == null ||
      startLng == null ||
      endLat == null ||
      endLng == null
    ) {
      return res.status(400).json({
        message:
          "날짜, 거리, 러닝 시간, 시작/도착 위치는 모두 필수입니다.",
      });
    }

    const dist = Number(distanceKm);
    const dur = Number(durationMin);

    const avg =
      avgSpeedKmh || (dist > 0 && dur > 0 ? (dist / (dur / 60)).toFixed(1) : 0);
    const kcal = calories || Math.round(dist * 60);

    const pathJson =
      Array.isArray(path) && path.length > 0 ? JSON.stringify(path) : null;

    await pool.query(
      `INSERT INTO runs
       (user_id, run_date, distance_km, duration_min, avg_speed_kmh, calories,
        course_name, memo, start_lat, start_lng, end_lat, end_lng, path_json)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        runDate,
        dist,
        dur,
        avg,
        kcal,
        courseName || null,
        memo || null,
        startLat,
        startLng,
        endLat,
        endLng,
        pathJson,
      ]
    );

    res.status(201).json({ message: "러닝 기록 저장 완료" });
  } catch (err) {
    console.error("create run error:", err);

    // 💡 FK 에러일 경우: 사실상 "유효하지 않은 사용자"이므로 401로 돌려보낼 수도 있음
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res
        .status(401)
        .json({ message: "유저 정보가 유효하지 않습니다. 다시 로그인해주세요." });
    }

    res.status(500).json({ message: "서버 오류" });
  }
});

// GET /api/runs  - 내 러닝 기록 목록
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT id, run_date, distance_km, duration_min, avg_speed_kmh, calories,
              course_name, memo, start_lat, start_lng, end_lat, end_lng
       FROM runs
       WHERE user_id = ?
       ORDER BY run_date DESC`,
      [userId]
    );

    res.json(rows);
  } catch (err) {
    console.error("list runs error:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// GET /api/runs/stats  - 내 러닝 통계
router.get("/stats", async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT run_date, distance_km, duration_min, avg_speed_kmh, calories
       FROM runs
       WHERE user_id = ?
       ORDER BY run_date ASC`,
      [userId]
    );

    const stats = buildStatsFromRuns(rows);
    res.json(stats);
  } catch (err) {
    console.error("stats error:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// GET /api/runs/:id  - 내 특정 기록 상세 (경로 포함)
router.get("/:id", async (req, res) => {
  const runId = Number(req.params.id);
  if (!runId) {
    return res.status(400).json({ message: "runId가 필요합니다." });
  }

  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT id, run_date, distance_km, duration_min, avg_speed_kmh,
              calories, course_name, memo,
              start_lat, start_lng, end_lat, end_lng, path_json
       FROM runs
       WHERE id = ? AND user_id = ?`,
      [runId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "기록을 찾을 수 없습니다." });
    }

    const run = rows[0];
    if (run.path_json) {
      try {
        run.path = JSON.parse(run.path_json);
      } catch (e) {
        console.warn("invalid path_json:", e);
        run.path = null;
      }
    } else {
      run.path = null;
    }
    delete run.path_json;

    res.json(run);
  } catch (err) {
    console.error("get run error:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;
