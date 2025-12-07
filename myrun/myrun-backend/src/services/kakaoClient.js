// myrun-backend/src/services/kakaoClient.js
// 카카오 Local(키워드 검색) + 카카오 모빌리티 길찾기 API 래퍼

const LOCAL_KEY = process.env.KAKAO_LOCAL_REST_API_KEY;
const MOBILITY_KEY =
  process.env.KAKAO_MOBILITY_REST_API_KEY || LOCAL_KEY;

if (!LOCAL_KEY) {
  console.warn(
    "[WARN] KAKAO_LOCAL_REST_API_KEY가 .env에 설정되어 있지 않습니다."
  );
}
if (!MOBILITY_KEY) {
  console.warn(
    "[WARN] KAKAO_MOBILITY_REST_API_KEY가 .env에 설정되어 있지 않습니다."
  );
}

/**
 * 장소 이름으로 카카오 Local 키워드 검색 → 좌표 얻기
 */
async function searchPlaceByKeyword(keyword) {
  const url =
    "https://dapi.kakao.com/v2/local/search/keyword.json" +
    `?query=${encodeURIComponent(keyword)}&size=1`;

  const res = await fetch(url, {
    headers: {
      Authorization: `KakaoAK ${LOCAL_KEY}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Kakao Local 검색 실패 (${res.status}): ${text}`
    );
  }

  const data = await res.json();

  if (!data.documents || data.documents.length === 0) {
    throw new Error(`장소를 찾을 수 없습니다: ${keyword}`);
  }

  const doc = data.documents[0];

  return {
    name: doc.place_name,
    lat: Number(doc.y), // 위도
    lng: Number(doc.x), // 경도
    address: doc.road_address_name || doc.address_name || "",
  };
}

/**
 * 출발지/도착지 "이름"만 받아서
 * 1) Local 검색으로 좌표 구하고
 * 2) 카카오 모빌리티 길찾기 API로 실제 도보 경로/거리 계산
 */
async function getRouteByPlaceNames(startName, endName) {
  // 1) 이름 → 좌표
  const [start, end] = await Promise.all([
    searchPlaceByKeyword(startName),
    searchPlaceByKeyword(endName),
  ]);

  // 2) 길찾기 (카카오 모빌리티 directions)
  const baseUrl = "https://apis-navi.kakaomobility.com/v1/directions";

  const params = new URLSearchParams({
    origin: `${start.lng},${start.lat}`, // x=lng, y=lat
    destination: `${end.lng},${end.lat}`,
    priority: "DISTANCE", // 최단 거리 기준
  });

  const res = await fetch(`${baseUrl}?${params.toString()}`, {
    headers: {
      Authorization: `KakaoAK ${MOBILITY_KEY}`,
      // 보통 이 헤더는 없어도 되지만, 혹시 모를 경우를 대비해 최소 os/origin 포함
      KA: "sdk/1.0 os=linux origin=http://localhost:3000",
    },
  });

  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `Kakao directions 응답 파싱 실패 (${res.status}): ${text}`
    );
  }

  if (!res.ok || !data.routes || data.routes.length === 0) {
    const msg = data.msg || data.message || "경로 없음";
    throw new Error(
      `Kakao directions 호출 실패 (${res.status}): ${msg}`
    );
  }

  const route = data.routes[0];
  const { summary, sections } = route;
  const distanceM = summary.distance; // m
  const durationSec = summary.duration; // 초

  // sections[*].roads[*].vertexes = [lng1,lat1,lng2,lat2, ...]
  const path = [];
  sections.forEach((section) => {
    if (!section.roads) return;
    section.roads.forEach((road) => {
      const v = road.vertexes || [];
      for (let i = 0; i < v.length; i += 2) {
        const lng = v[i];
        const lat = v[i + 1];
        path.push({ lat, lng });
      }
    });
  });

  return {
    start,
    end,
    distanceKm: Number((distanceM / 1000).toFixed(2)),
    durationMin: Math.round(durationSec / 60),
    path, // [{lat, lng}, ...] - 프론트에서 polyline으로 사용
  };
}

module.exports = {
  searchPlaceByKeyword,
  getRouteByPlaceNames,
};
