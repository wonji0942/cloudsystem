// myrun-backend/src/db.js
const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: process.env.DB_HOST || "myrun-mysql", // 🔴 중요: 컨테이너 이름
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  user: process.env.DB_USER || "myrun",
  password: process.env.DB_PASSWORD || "myrunpw",
  database: process.env.DB_NAME || "myrun",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
