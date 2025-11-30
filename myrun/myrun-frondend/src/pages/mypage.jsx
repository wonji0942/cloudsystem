// src/pages/mypage.jsx
import React from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

export default function MyPage() {
  const navigate = useNavigate();

  const handleFirstRowClick = () => {
    // 예: <Route path="/specificpage" element={<SpecificPage />} />
    navigate("/specific");
  };

  return (
    <div className="mypage-page">
      {/* 상단 헤더는 메인/코스 추천과 동일 스타일 재사용 */}
      <header className="main-header">
        <div className="main-header-logo">MyRun</div>
        <button className="main-header-menu">
          <span />
          <span />
          <span />
        </button>
      </header>

      <main className="mypage-main">
        {/* 위쪽 그래프 카드 3개 */}
        <section className="mypage-cards">
          <div className="mypage-card">
            <h3 className="mypage-card-title">러닝 거리(month)</h3>
            <div className="mypage-chart-placeholder">그래프 영역</div>
          </div>
          <div className="mypage-card">
            <h3 className="mypage-card-title">러닝 거리(week)</h3>
            <div className="mypage-chart-placeholder">그래프 영역</div>
          </div>
          <div className="mypage-card">
            <h3 className="mypage-card-title">평균 페이스</h3>
            <div className="mypage-chart-placeholder">그래프 영역</div>
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
              {/* 🔹 첫 번째 행: 클릭 시 specificpage로 이동 */}
              <tr className="mypage-row clickable-row" onClick={handleFirstRowClick}>
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