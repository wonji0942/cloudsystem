// src/pages/record.jsx
import "../App.css";
import { useNavigate } from "react-router-dom";

export default function Record() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault(); // 새로고침 막기
    // TODO: 나중에 여기에서 실제로 서버에 저장 요청 보내기
    navigate("/main"); // 저장 후 메인 페이지로 이동
  };

  return (
    <div className="record-page">
      {/* 상단 파란 헤더 */}
      <header className="main-header">
        <div className="main-header-logo">MyRun</div>
        <button className="main-header-menu">
          <span />
          <span />
          <span />
        </button>
      </header>

      <main className="record-main">
        <h1 className="record-title">나의 러닝 기록하기</h1>

        <form className="record-form" onSubmit={handleSubmit}>
          {/* 날짜 */}
          <div className="record-row">
            <label className="record-label" htmlFor="date">
              날짜
            </label>
            <input
              id="date"
              type="text"
              className="record-input"
              placeholder="2025. 11. 15"
            />
          </div>

          {/* 거리 */}
          <div className="record-row">
            <label className="record-label" htmlFor="distance">
              거리
            </label>
            <div className="record-input-with-unit">
              <input
                id="distance"
                type="text"
                className="record-input"
                placeholder="3.0"
              />
              <span className="record-unit">km</span>
            </div>
          </div>

          {/* 러닝 시간 */}
          <div className="record-row">
            <label className="record-label" htmlFor="time">
              러닝 시간
            </label>
            <input
              id="time"
              type="text"
              className="record-input"
              placeholder="1시간 10분"
            />
          </div>

          {/* 코스 정보 */}
          <div className="record-row">
            <label className="record-label" htmlFor="course">
              코스 정보
            </label>
            <textarea
              id="course"
              className="record-textarea"
              placeholder="코스 정보를 입력하세요"
            />
          </div>

          {/* 저장 버튼 */}
          <button type="submit" className="record-submit-btn">
            저장
          </button>
        </form>
      </main>
    </div>
  );
}