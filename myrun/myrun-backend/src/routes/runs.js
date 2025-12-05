// myrun-backend/src/routes/runs.js
const express = require("express");
const pool = require("../db");
const { buildStatsFromRuns } = require("../utils/stats");
const auth = require("../middleware/auth");

const router = express.Router();

// 🔐 이 라우터 이하 모든 API는 로그인 필요
router.use(auth);

// POST /api/runs  - 러닝 기록 저장 (로그인한 사용자 기준)
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
    } = req.body;

    if (!runDate || !distanceKm || !durationMin) {
      return res
        .status(400)
        .json({ message: "날짜, 거리, 러닝 시간은 필수입니다." });
    }

    const dist = Number(distanceKm);
    const dur = Number(durationMin);

    const avg =
      avgSpeedKmh || (dist > 0 && dur > 0 ? (dist / (dur / 60)).toFixed(1) : 0);
    const kcal = calories || Math.round(dist * 60);

    await pool.query(
      `INSERT INTO runs
       (user_id, run_date, distance_km, duration_min, avg_speed_kmh, calories, course_name, memo)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, runDate, dist, dur, avg, kcal, courseName || null, memo || null]
    );

    res.status(201).json({ message: "러닝 기록 저장 완료" });
  } catch (err) {
    console.error("create run error:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// GET /api/runs  - 내 러닝 기록 목록
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT id, run_date, distance_km, duration_min, avg_speed_kmh, calories, course_name, memo
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

// GET /api/runs/:id  - 내 특정 기록 상세
router.get("/:id", async (req, res) => {
  const runId = Number(req.params.id);
  if (!runId) {
    return res.status(400).json({ message: "runId가 필요합니다." });
  }

  try {
    const userId = req.user.id;

    const [rows] = await pool.query(
      `SELECT id, run_date, distance_km, duration_min, avg_speed_kmh,
              calories, course_name, memo
       FROM runs
       WHERE id = ? AND user_id = ?`,
      [runId, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "기록을 찾을 수 없습니다." });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("get run error:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;
