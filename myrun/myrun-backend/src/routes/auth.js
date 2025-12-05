// myrun-backend/src/routes/auth.js
const express = require("express");
const pool = require("../db");

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, password, name, height, weight, age, gender } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "아이디(username)와 비밀번호는 필수입니다." });
    }

    const [existing] = await pool.query(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: "이미 존재하는 아이디입니다." });
    }

    const [result] = await pool.query(
      `INSERT INTO users (username, password, name, height_cm, weight_kg, age, gender)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        username,
        password,
        name || null,
        height || null,
        weight || null,
        age || null,
        gender || "male",
      ]
    );

    res.status(201).json({
      message: "회원가입 성공",
      userId: result.insertId,
    });
  } catch (err) {
    console.error("register error:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const [rows] = await pool.query(
      "SELECT id, username, name FROM users WHERE username = ? AND password = ?",
      [username, password]
    );

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." });
    }

    const user = rows[0];
    res.json({
      message: "로그인 성공",
      userId: user.id,
      username: user.username,
      name: user.name,
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;
