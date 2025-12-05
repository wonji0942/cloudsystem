// myrun-backend/src/routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");

const router = express.Router();

function createToken(user) {
  const secret = process.env.JWT_SECRET || "dev-secret";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";

  return jwt.sign(
    {
      userId: user.id,
      username: user.username,
    },
    secret,
    { expiresIn }
  );
}

// POST /api/auth/register  - 회원가입
router.post("/register", async (req, res) => {
  try {
    const {
      username,
      password,
      name,
      height,
      weight,
      age,
      gender,
    } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "아이디(username)와 비밀번호는 필수입니다." });
    }

    // 아이디 중복 확인
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );

    if (existing.length > 0) {
      return res.status(409).json({ message: "이미 존재하는 아이디입니다." });
    }

    // 비밀번호 해시
    const hashed = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users (username, password, name, height_cm, weight_kg, age, gender)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        username,
        hashed,
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

// POST /api/auth/login  - 로그인
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ message: "아이디와 비밀번호를 입력해주세요." });
    }

    const [rows] = await pool.query(
      `SELECT id, username, password, name, height_cm, weight_kg, age, gender
       FROM users
       WHERE username = ?
       LIMIT 1`,
      [username]
    );

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." });
    }

    const user = rows[0];

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res
        .status(401)
        .json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." });
    }

    const token = createToken(user);

    const userResponse = {
      id: user.id,
      username: user.username,
      name: user.name,
      heightCm: user.height_cm,
      weightKg: user.weight_kg,
      age: user.age,
      gender: user.gender,
    };

    res.json({
      message: "로그인 성공",
      token,
      user: userResponse,
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ message: "서버 오류" });
  }
});

module.exports = router;
