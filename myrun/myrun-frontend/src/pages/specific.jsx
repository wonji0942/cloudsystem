// src/pages/specific.jsx
import React, { useEffect, useState } from "react";
import "../App.css";
import { useLocation, useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../api";
import { getAuth, getToken, clearAuth } from "../auth";

function useQuery() {
  const { search } = useLocation();
  return new URLSearchParams(search);
}

export default function SpecificPage() {
  const query = useQuery();
  const navigate = useNavigate();
  const runId = query.get("id");
  const [run, setRun] = useState(null);

  // 로그인 + 데이터 로드
  useEffect(() => {
    const auth = getAuth();
    if (!auth?.token) {
      navigate("/");
      return;
    }

    if (!runId) return;

    async function fetchRun() {
      try {
        const token = getToken();
        const res = await fetch(`${API_BASE_URL}/api/runs/${runId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          clearAuth();
          navigate("/");
          return;
        }

        const data = await res.json();
        if (!res.ok) {
          console.error(data);
          return;
        }

        setRun(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchRun();
  }, [navigate, runId]);

  // 지도: 저장된 경로(또는 start/end) 기반으로 표시
  useEffect(() => {
    if (!run) return;
    if (!window.kakao || !window.kakao.maps) {
      console.warn("카카오 지도 스크립트가 로드되지 않았습니다.");
      return;
    }

    const { kakao } = window;
    const container = document.getElementById("map");
    if (!container) return;

    // 기본 중심: 숙대 근처
    let centerLat = 37.545419;
    let centerLng = 126.964649;

    if (run.start_lat != null && run.start_lng != null) {
      centerLat = Number(run.start_lat);
      centerLng = Number(run.start_lng);
    }

    const map = new kakao.maps.Map(container, {
      center: new kakao.maps.LatLng(centerLat, centerLng),
      level: 4,
    });

    const bounds = new kakao.maps.LatLngBounds();

    // 시작/도착 마커
    if (run.start_lat != null && run.start_lng != null) {
      const startPos = new kakao.maps.LatLng(
        Number(run.start_lat),
        Number(run.start_lng)
      );
      const startMarker = new kakao.maps.Marker({
        position: startPos,
      });
      startMarker.setMap(map);
      bounds.extend(startPos);
    }

    if (run.end_lat != null && run.end_lng != null) {
      const endPos = new kakao.maps.LatLng(
        Number(run.end_lat),
        Number(run.end_lng)
      );
      const endMarker = new kakao.maps.Marker({
        position: endPos,
      });
      endMarker.setMap(map);
      bounds.extend(endPos);
    }

    // 경로(Polyline)
    let path = [];

    if (Array.isArray(run.path) && run.path.length >= 2) {
      path = run.path.map(
        (p) => new kakao.maps.LatLng(Number(p.lat), Number(p.lng))
      );
    } else if (
      run.start_lat != null &&
      run.start_lng != null &&
      run.end_lat != null &&
      run.end_lng != null
    ) {
      path = [
        new kakao.maps.LatLng(Number(run.start_lat), Number(run.start_lng)),
        new kakao.maps.LatLng(Number(run.end_lat), Number(run.end_lng)),
      ];
    }

    if (path.length >= 2) {
      const polyline = new kakao.maps.Polyline({
        path,
        strokeWeight: 5,
        strokeColor: "#535bf2",
        strokeOpacity: 0.9,
        strokeStyle: "solid",
      });
      polyline.setMap(map);

      path.forEach((p) => bounds.extend(p));
      map.setBounds(bounds);
    } else if (!bounds.isEmpty && bounds.isEmpty?.() === false) {
      // kakao LatLngBounds에는 isEmpty 없을 수 있으니 그냥 center 기본 유지
    }
  }, [run]);

  const dateText = run ? run.run_date : "";
  const distanceText = run ? `${run.distance_km}km` : "";
  const durationText = run ? `${run.duration_min}분` : "";
  const speedText = run ? `${run.avg_speed_kmh}km/h` : "";
  const calText = run ? `${run.calories}kcal` : "";

  return (
    <div className="specific-page">
      <main className="specific-main">
        {/* 상단 요약 테이블 */}
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
                <td>{dateText}</td>
                <td>{distanceText}</td>
                <td>{durationText}</td>
                <td>{speedText}</td>
                <td>{calText}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* 코스 정보 + 지도 */}
        <section className="specific-info-section">
          <div className="specific-info-left">
            <div className="specific-info-title-pill">코스 정보</div>
            <div className="specific-info-box">
              <ul>
                <li>{run?.course_name || "코스 이름 정보 없음"}</li>
                <li>{run?.memo || "메모가 없습니다."}</li>
              </ul>
            </div>
          </div>

          <div className="specific-map-box">
            <div className="specific-map-placeholder">
              <div
                id="map"
                style={{ width: "100%", height: "400px" }}
              ></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
