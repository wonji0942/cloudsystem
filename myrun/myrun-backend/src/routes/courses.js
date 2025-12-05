// myrun-backend/src/routes/courses.js
const express = require("express");
const pool = require("../db");

const router = express.Router();

// GET /api/courses?distanceRange=&level=&area=
router.get("/", async (req, res) => {
  try {
    const { distanceRange, level, area } = req.query;

    let query =
      "SELECT id, name, area, distance_km, level, description FROM courses WHERE 1=1";
    const params = [];

    if (level && level !== "선택없음") {
      query += " AND level = ?";
      params.push(level);
    }

    if (area && area !== "선택없음") {
      query += " AND area = ?";
      params.push(area);
    }

    if (distanceRange && distanceRange !== "선택없음") {
      if (distanceRange === "5km 이하") {
        query += " AND distance_km <= 5";
      } else if (distanceRange === "5~10km") {
        query += " AND distance_km > 5 AND distance_km <= 10";
      } else if (distanceRange === "10km 이상") {
        query += " AND distance_km > 10";
      }
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error("courses error:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;
