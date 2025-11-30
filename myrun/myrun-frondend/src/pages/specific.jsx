// src/pages/specificpage.jsx
import React from "react";
import "../App.css";

export default function SpecificPage() {
  return (
    <div className="specific-page">
      {/* 상단 공통 헤더 */}
      <header className="main-header">
        <div className="main-header-logo">MyRun</div>
        <button className="main-header-menu">
          <span />
          <span />
          <span />
        </button>
      </header>

      <main className="specific-main">
        {/* 상단 러닝 기록 한 줄 요약 테이블 */}
        <section className="specific-table-section">
          <table className="specific-table">
            <thead>
              <tr>
                <th>날짜</th>
                <th>뛴 거리</th>
                <th>뛴 시간</th>
                <th>평균 속력</th>
                <th>총 소모 칼로리</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>11월 15일</td>
                <td>3km</td>
                <td>1시간 10분</td>
                <td>3.5km/h</td>
                <td>250kcal</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 아래 코스 정보 + 지도 영역 */}
        <section className="specific-info-section">
          {/* 왼쪽 코스 정보 */}
          <div className="specific-info-left">
            <div className="specific-info-title-pill">코스 정보</div>
            <div className="specific-info-box">
              <ul>
                <li>숙명여대 옆에 위치</li>
                <li>약 300m 동안 급경사 구간 있음</li>
                <li>사람 적음</li>
                <li>동물 많음</li>
              </ul>
            </div>
          </div>

          {/* 오른쪽 지도 (나중에 API 연동) */}
          <div className="specific-map-box">
            <div className="specific-map-placeholder">
              {/* 여기 안을 나중에 지도 API 컴포넌트로 교체하면 됨 */}
              지도 영역 (API 연동 예정)
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}