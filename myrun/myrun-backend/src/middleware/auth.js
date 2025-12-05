// myrun-backend/src/middleware/auth.js
const jwt = require("jsonwebtoken");

function auth(req, res, next) {
  const authHeader = req.headers["authorization"] || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: "로그인이 필요합니다." });
  }

  try {
    const secret = process.env.JWT_SECRET || "dev-secret";
    const payload = jwt.verify(token, secret);
    // payload에 userId, username 담아둘 거임
    req.user = {
      id: payload.userId,
      username: payload.username,
    };
    next();
  } catch (err) {
    console.error("auth middleware error:", err);
    return res
      .status(401)
      .json({ message: "유효하지 않은 토큰입니다. 다시 로그인해주세요." });
  }
}

module.exports = auth;
