// src/pages/recommend.jsx
import React, { useState, useEffect, useRef } from "react";
import "../App.css";
import { API_BASE_URL } from "../api";

export default function Recommend() {
  const [distance, setDistance] = useState("선택없음");
  const [level, setLevel] = useState("하");
  const [area, setArea] = useState("선택없음");

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [error, setError] = useState("");

  const [routeInfo, setRouteInfo] = useState(null); // {distanceMeters, durationSeconds, path}

  const mapRef = useRef(null);
  const polylineRef = useRef(null);

  // 1) 지도 초기화
  useEffect(() => {
    if (!window.kakao || !window.kakao.maps) {
      console.warn("카카오 지도 스크립트가 로드되지 않았습니다.");
      return;
    }
    const { kakao } = window;
    const container = document.getElementById("map");
    if (!container) return;

    const options = {
      center: new kakao.maps.LatLng(37.545419, 126.964649),
      level: 7,
    };
    const map = new kakao.maps.Map(container, options);
    mapRef.current = map;
  }, []);

  // 2) 필터 값이 바뀔 때마다 코스 목록 로드
  useEffect(() => {
    async function fetchCourses() {
      try {
        setError("");
        const params = new URLSearchParams();
        params.append("distance", distance);
        params.append("level", level || "전체");
        params.append("area", area);

        const res = await fetch(
          `${API_BASE_URL}/api/courses?${params.toString()}`
        );
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.message || "코스 정보를 불러오는 중 오류가 발생했습니다.");
          setCourses([]);
          setSelectedCourse(null);
          return;
        }

        const data = await res.json();
        setCourses(data);
        setSelectedCourse(data[0] || null);
      } catch (err) {
        console.error(err);
        setError("서버에 연결할 수 없습니다.");
        setCourses([]);
        setSelectedCourse(null);
      }
    }

    fetchCourses();
  }, [distance, level, area]);

  // 3) 선택된 코스가 바뀔 때마다 카카오 길찾기 API를 통해 경로 로드
  useEffect(() => {
    async function loadRoute(course) {
      if (!course) {
        setRouteInfo(null);
        return;
      }
      if (!mapRef.current) return;

      try {
        setError("");

        const params = new URLSearchParams({
          startLat: String(course.startLat),
          startLng: String(course.startLng),
          endLat: String(course.endLat),
          endLng: String(course.endLng),
        });

        const res = await fetch(
          `${API_BASE_URL}/api/nav/route?${params.toString()}`
        );

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          console.error("route error:", data);
          setError(
            data.message ||
              "경로 정보를 불러오는 중 오류가 발생했습니다. (카카오 길찾기)"
          );
          setRouteInfo(null);
          drawRoute(null);
          return;
        }

        const data = await res.json();
        setRouteInfo(data);
        drawRoute(data.path || []);
      } catch (err) {
        console.error(err);
        setError("경로를 불러오는 중 서버 오류가 발생했습니다.");
        setRouteInfo(null);
        drawRoute(null);
      }
    }

    loadRoute(selectedCourse);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourse]);

  // 4) 지도 위에 Polyline 그리기
  const drawRoute = (pathArray) => {
    if (!window.kakao || !window.kakao.maps || !mapRef.current) return;
    const { kakao } = window;
    const map = mapRef.current;

    // 기존 라인 제거
    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    if (!Array.isArray(pathArray) || pathArray.length === 0) {
      return;
    }

    const kakaoPath = pathArray.map(
      (p) => new kakao.maps.LatLng(p.lat, p.lng)
    );

    const polyline = new kakao.maps.Polyline({
      path: kakaoPath,
      strokeWeight: 5,
      strokeColor: "#535bf2",
      strokeOpacity: 0.9,
      strokeStyle: "solid",
    });
    polyline.setMap(map);
    polylineRef.current = polyline;

    // 지도를 경로 전체가 보이도록 조정
    const bounds = new kakao.maps.LatLngBounds();
    kakaoPath.forEach((p) => bounds.extend(p));
    map.setBounds(bounds);
  };

  const handleSelectCourse = (course) => {
    setSelectedCourse(course);
  };

  // UI에 보여줄 거리(km): 가능하면 길찾기 API 결과 사용, 없으면 기존 distanceKm
  const getDisplayDistanceKm = () => {
    if (routeInfo && routeInfo.distanceMeters != null) {
      return (routeInfo.distanceMeters / 1000).toFixed(2);
    }
    if (selectedCourse && selectedCourse.distanceKm != null) {
      return selectedCourse.distanceKm.toFixed(2);
    }
    return "-";
  };

  return (
    <div className="recommend-page">
      <main className="recommend-main">
        <div className="recommend-layout">
          {/* 왼쪽: 지도 영역 */}
          <section className="recommend-map">
            <div className="map-placeholder">
              <div
                id="map"
                style={{ width: "100%", height: "400px", borderRadius: "8px" }}
              ></div>
            </div>
            {selectedCourse && (
              <div style={{ marginTop: "8px", fontSize: "14px" }}>
                <strong>{selectedCourse.name}</strong> <br />
                거리: {getDisplayDistanceKm()}km / 난이도:{" "}
                {selectedCourse.level} / 지역: {selectedCourse.area}
                {routeInfo && routeInfo.durationSeconds != null && (
                  <>
                    <br />
                    예상 소요 시간(자동차 기준):{" "}
                    {Math.round(routeInfo.durationSeconds / 60)}분
                  </>
                )}
              </div>
            )}
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
                    <option value="전체">전체</option>
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
                    <option value="선택없음">선택없음</option>
                    {/* 서울시 25개 구 */}
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

            {/* 🔹 에러 표시 */}
            {error && (
              <div
                style={{
                  color: "#ef4444",
                  marginBottom: "8px",
                  fontSize: "13px",
                }}
              >
                {error}
              </div>
            )}

            {/* 🔹 코스 리스트 */}
            <div className="recommend-list">
              {courses.length === 0 && !error && (
                <div style={{ fontSize: "13px", padding: "8px" }}>
                  조건에 맞는 코스가 없습니다.
                </div>
              )}

              {courses.map((course) => (
                <div
                  key={course.id}
                  className={
                    "course-row" +
                    (selectedCourse && selectedCourse.id === course.id
                      ? " course-row-active"
                      : "")
                  }
                  onClick={() => handleSelectCourse(course)}
                >
                  <span className="course-name">{course.name}</span>
                  <span className="course-distance">
                    {course.distanceKm.toFixed(2)}km
                  </span>
                  <span className="course-level">{course.level}</span>
                  <span className="course-area">{course.area}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
