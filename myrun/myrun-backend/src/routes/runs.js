// myrun-backend/src/routes/runs.js
const express = require("express");
const pool = require("../db");
const { buildStatsFromRuns } = require("../utils/stats");

const router = express.Router();

// 🔹 항상 사용할 "기본 유저" 이름 (과제/데모용)
const DEFAULT_USERNAME = "testuser";

/**
 * 기본 유저(testuser)의 id를 가져온다.
 * - 없으면 새로 만들어서 id 반환
 */
async function getDefaultUserId() {
  // 1) 이미 있는지 확인
  const [rows] = await pool.query(
    "SELECT id FROM users WHERE username = ? LIMIT 1",
    [DEFAULT_USERNAME]
  );
  if (rows.length > 0) {
    return rows[0].id;
  }

  // 2) 없으면 새로 생성
  const [result] = await pool.query(
    `INSERT INTO users (username, password, name, height_cm, weight_kg, age, gender)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [DEFAULT_USERNAME, "1234", "기본유저", 170, 60, 25, "male"]
  );
  return result.insertId;
}

// POST /api/runs  - 러닝 기록 저장
router.post("/", async (req, res) => {
  try {
    // 🔹 항상 기본 유저 기준으로 저장
    const userId = await getDefaultUserId();

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

// GET /api/runs  - 목록
router.get("/", async (req, res) => {
  try {
    const userId = await getDefaultUserId();

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

// GET /api/runs/stats  - 통계
router.get("/stats", async (req, res) => {
  try {
    const userId = await getDefaultUserId();

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

// GET /api/runs/:id  - 상세
router.get("/:id", async (req, res) => {
  const runId = Number(req.params.id);
  if (!runId) {
    return res.status(400).json({ message: "runId가 필요합니다." });
  }

  try {
    const userId = await getDefaultUserId();

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
