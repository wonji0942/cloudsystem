// src/pages/recommend.jsx
import React, { useState, useEffect } from "react";
import "../App.css";

export default function Recommend() {
  const [distance, setDistance] = useState("선택없음");
  const [level, setLevel] = useState("하");
  const [area, setArea] = useState("용산구"); // 기본값은 용산구로

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      const container = document.getElementById("map");
      const options = {
        center: new window.kakao.maps.LatLng(37.545419, 126.964649), // 원하는 초기 위치(숙대)
        level: 3,
      };
      const map = new window.kakao.maps.Map(container, options);

      var linePath = [
        new window.kakao.maps.LatLng(37.550229, 126.972475),
        new window.kakao.maps.LatLng(37.547639, 126.966888),
        new window.kakao.maps.LatLng(37.545419, 126.964649)
      ]; //예시... 선그리기 좌표를 저장할 배열. 추후 백엔드에서 받아온 좌표로 선 그리기

      var polyline = new window.kakao.maps.Polyline({
        path: linePath, // 선을 구성하는 좌표
        strokeWeight: 5,
        strokeColor: '#535bf2;',
        strokeOpacity: 0.7,
        strokeStyle: 'solid' //선의 특징
      });

      polyline.setMap(map); // 지도에 선을 표시
    }
  }, []);



  return (
    <div className="recommend-page">

      <main className="recommend-main">
        <div className="recommend-layout">
          {/* 왼쪽: 지도 영역 */}
          <section className="recommend-map">
            <div className="map-placeholder">
              <div id="map" style={{ width: "100%", height: "400px" }}></div> {/* 카카오 지도 연동 */}
            </div>
          </section>
          {/* 오른쪽: 필터 + 코스 리스트 */}
          <aside className="recommend-side">
            {/* 🔹 필터 줄 */}
            <div className="recommend-filters">
              {/* 거리 */}
              <div className="filter-group">
                <span className="filter-label">거리</span>
                <div className="filter-select-wrapper">
                  <select
                    className="filter-select"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                  >
                    <option value="선택없음">선택없음</option>
                    <option value="5km 이하">5km 이하</option>
                    <option value="5~10km">5~10km</option>
                    <option value="10km 이상">10km 이상</option>
                  </select>
                  <span className="filter-select-arrow">▾</span>
                </div>
              </div>

              {/* 난이도 */}
              <div className="filter-group">
                <span className="filter-label">난이도</span>
                <div className="filter-select-wrapper">
                  <select
                    className="filter-select"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                  >
                    <option value="하">하</option>
                    <option value="중">중</option>
                    <option value="상">상</option>
                  </select>
                  <span className="filter-select-arrow">▾</span>
                </div>
              </div>

              {/* 지역 */}
              <div className="filter-group">
                <span className="filter-label">지역</span>
                <div className="filter-select-wrapper">
                  <select
                    className="filter-select"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                  >
                    {/* 원하면 맨 위에 “선택없음” 추가해도 됨 */}
                    <option value="선택없음">선택없음</option>

                    {/* 서울시 25개 구 전체 */}
                    <option value="강남구">강남구</option>
                    <option value="강동구">강동구</option>
                    <option value="강북구">강북구</option>
                    <option value="강서구">강서구</option>
                    <option value="관악구">관악구</option>
                    <option value="광진구">광진구</option>
                    <option value="구로구">구로구</option>
                    <option value="금천구">금천구</option>
                    <option value="노원구">노원구</option>
                    <option value="도봉구">도봉구</option>
                    <option value="동대문구">동대문구</option>
                    <option value="동작구">동작구</option>
                    <option value="마포구">마포구</option>
                    <option value="서대문구">서대문구</option>
                    <option value="서초구">서초구</option>
                    <option value="성동구">성동구</option>
                    <option value="성북구">성북구</option>
                    <option value="송파구">송파구</option>
                    <option value="양천구">양천구</option>
                    <option value="영등포구">영등포구</option>
                    <option value="용산구">용산구</option>
                    <option value="은평구">은평구</option>
                    <option value="종로구">종로구</option>
                    <option value="중구">중구</option>
                    <option value="중랑구">중랑구</option>
                  </select>
                  <span className="filter-select-arrow">▾</span>
                </div>
              </div>
            </div>

            {/* 🔹 코스 리스트 */}
            <div className="recommend-list">
              {/* 선택된 코스 */}
              <div className="course-row course-row-active">
                <span className="course-name">효창공원</span>
                <span className="course-distance">12km</span>
                <span className="course-level">{level}</span>
                <span className="course-area">{area}</span>
              </div>

              {/* 빈 슬롯들 */}
              <div className="course-row course-row-empty" />
              <div className="course-row course-row-empty" />
              <div className="course-row course-row-empty" />
              <div className="course-row course-row-empty" />
              <div className="course-row course-row-empty" />
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}