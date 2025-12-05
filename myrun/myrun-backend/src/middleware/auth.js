// myrun-backend/src/middleware/auth.js
const jwt = require("jsonwebtoken");
const pool = require("../db");

// ✅ 모든 보호된 API는 이 미들웨어를 거침
// 1) Authorization 헤더에서 토큰 꺼내서 검증
// 2) 토큰 속 userId가 실제 DB users 테이블에 존재하는지 확인
//    - 없으면 401 → 프론트에서 자동 로그아웃
async function auth(req, res, next) {
  const authHeader = req.headers["authorization"] || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  let payload;
  try {
    const secret = process.env.JWT_SECRET || "dev-secret";
    payload = jwt.verify(token, secret);
  } catch (err) {
    console.error("auth jwt error:", err);
    return res
      .status(401)
      .json({ message: "유효하지 않은 토큰입니다. 다시 로그인해주세요." });
  }

  try {
    // 🔎 토큰에 있는 userId가 실제 DB에 존재하는지 확인
    const [rows] = await pool.query(
      "SELECT id, username FROM users WHERE id = ? LIMIT 1",
      [payload.userId]
    );

    if (rows.length === 0) {
      // 더 이상 존재하지 않는 유저 → 강제 로그아웃 유도
      return res
        .status(401)
        .json({ message: "존재하지 않는 사용자입니다. 다시 로그인해주세요." });
    }

    const user = rows[0];

    // 이후 라우터에서 req.user 로 사용
    req.user = {
      id: user.id,
      username: user.username,
    };

    next();
  } catch (err) {
    console.error("auth db error:", err);
    return res.status(500).json({ message: "인증 중 서버 오류" });
  }
}

module.exports = auth;
