// src/pages/main.jsx
import "../App.css";
import { useNavigate } from "react-router-dom";

export default function Main() {
  const navigate = useNavigate();

  return (
    <div className="main-page">
      {/* 상단 파란 헤더 */}
      <header className="main-header">
        <div className="main-header-logo">MyRun</div>
        <button className="main-header-menu">
          <span />
          <span />
          <span />
        </button>
      </header>

      {/* 가운데 내용 */}
      <div className="main-layout">
        {/* 왼쪽: 이번 주 러닝 기록 카드 */}
        <section className="main-card">
          <h2 className="main-section-title">이번 주 러닝 기록</h2>

          <div className="stats-grid">
            <div className="stats-card">
              <p className="stats-label">달린 거리</p>
              <p className="stats-value">24km</p>
            </div>
            <div className="stats-card">
              <p className="stats-label">달린 시간</p>
              <p className="stats-value">6시간</p>
            </div>
            <div className="stats-card">
              <p className="stats-label">소모 칼로리</p>
              <p className="stats-value">000kcal</p>
            </div>
            <div className="stats-card">
              <p className="stats-label">평균 페이스</p>
              <p className="stats-value">4.3km/h</p>
            </div>
          </div>
        </section>

        {/* 오른쪽: 버튼 3개 */}
        <aside className="main-side">
          <button
            className="main-side-btn"
            onClick={() => navigate("/record")}
          >
            러닝 기록하기
          </button>
          <button
            className="main-side-btn"
            onClick={() => navigate("/recommend")}
          >
            코스 추천
          </button>
          <button
            className="main-side-btn"
            onClick={() => navigate("/mypage")}
          >
            마이페이지
          </button>
        </aside>
      </div>
    </div>
  );
}