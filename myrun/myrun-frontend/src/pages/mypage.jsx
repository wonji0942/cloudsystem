// src/pages/mypage.jsx
import React from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";
// Recharts 추가
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MyPage() {
  const navigate = useNavigate();

  const handleFirstRowClick = () => {
    navigate("/specific");
  };

  // 임시 더미 데이터 (나중에 API/DB 값으로 교체 가능)
  const monthDistanceData = [
    { name: "1주", distance: 3 },
    { name: "2주", distance: 5 },
    { name: "3주", distance: 4 },
    { name: "4주", distance: 6 },
  ];

  const weekDistanceData = [
    { name: "월", distance: 1 },
    { name: "화", distance: 2 },
    { name: "수", distance: 1.5 },
    { name: "목", distance: 3 },
    { name: "금", distance: 2.5 },
    { name: "토", distance: 4 },
    { name: "일", distance: 0 },
  ];

  const paceData = [
    { name: "1km", pace: 7.2 },
    { name: "2km", pace: 6.8 },
    { name: "3km", pace: 6.5 },
    { name: "4km", pace: 6.9 },
    { name: "5km", pace: 6.6 },
  ];

  return (
    <div className="mypage-page">
      <main className="mypage-main">
        {/* 위쪽 그래프 카드 3개 */}
        <section className="mypage-cards">
          {/* 월별 러닝 거리 그래프 */}
          <div className="mypage-card">
            <h3 className="mypage-card-title">러닝 거리(month)</h3>
            <div className="mypage-chart-placeholder">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={monthDistanceData}
                  margin={{ top: 10, right: 10, left: 20, bottom: 0 }}
                >
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis hide />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="distance"
                    stroke="#4c8dff"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 🔹 주별 러닝 거리 그래프 */}
          <div className="mypage-card">
            <h3 className="mypage-card-title">러닝 거리(week)</h3>
            <div className="mypage-chart-placeholder">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={weekDistanceData}
                  margin={{ top: 10, right: 10, left: 20, bottom: 0 }}
                >
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis hide />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="distance"
                    stroke="#4c8dff"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* 🔹 평균 페이스 그래프 */}
          <div className="mypage-card">
            <h3 className="mypage-card-title">평균 페이스</h3>
            <div className="mypage-chart-placeholder">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={paceData}
                  margin={{ top: 10, right: 10, left: 20, bottom: 0 }}
                >
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis hide />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="pace"
                    stroke="#4c8dff"
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* 아래쪽 표 */}
        <section className="mypage-table-section">
          <table className="mypage-table">
            <thead>
              <tr>
                <th>날짜</th>
                <th>뛴 거리</th>
                <th>뛴 시간</th>
                <th>평균 속력</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className="mypage-row clickable-row"
                onClick={handleFirstRowClick}
              >
                <td>11월 15일</td>
                <td>3km</td>
                <td>1시간 10분</td>
                <td>3.5km/h</td>
              </tr>
              <tr className="mypage-row">
                <td>11월 12일</td>
                <td>1km</td>
                <td>30분</td>
                <td>2.6km/h</td>
              </tr>
              <tr className="mypage-row">
                <td>11월 7일</td>
                <td>26km</td>
                <td>4시간 15분</td>
                <td>4.2km/h</td>
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}