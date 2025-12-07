// myrun-backend/src/sampleCourses.js

// 거리 기준 난이도 매핑: <5km 하 / 5~10km 중 / >10km 상
function levelFromDistance(km) {
  if (km < 5) return "하";
  if (km < 10) return "중";
  return "상";
}

// 공공 데이터(TB_TRKG_TRK_INFO_D)의 서울 코스 15개를 정리한 샘플
const sampleCourses = [
  {
    id: 201940,
    // 원본: 새해_첫__넌닝_20181231_230317 (마포구 신수동)
    name: "마포구 신수동 새해 첫 넌닝 코스",
    area: "마포구",
    distanceKm: 8.09,
    level: levelFromDistance(8.09),
    description: "서울특별시 마포구 신수동 일대 약 8.09km 한강 러닝 코스",
    startLat: 37.544453,
    startLng: 126.93129,
    endLat: 37.544529,
    endLng: 126.931351,
  },
  {
    id: 20196130,
    // 원본: 서울특별시영등포구_20190101_090425 (영등포구 여의동)
    name: "영등포구 여의동 짧은 러닝 코스",
    area: "영등포구",
    distanceKm: 0.17,
    level: levelFromDistance(0.17),
    description: "서울특별시 영등포구 여의동 일대 약 0.17km 짧은 워밍업 코스",
    startLat: 37.529808,
    startLng: 126.930115,
    endLat: 37.529934,
    endLng: 126.930283,
  },
  {
    id: 2019155,
    // 서울특별시송파구_20190101_003123 (송파구 석촌동)
    name: "송파구 석촌호수 순환 코스",
    area: "송파구",
    distanceKm: 5.33,
    level: levelFromDistance(5.33),
    description: "서울특별시 송파구 석촌동 일대 약 5.33km 석촌호수 러닝 코스",
    startLat: 37.505299,
    startLng: 127.097221,
    endLat: 37.491131,
    endLng: 127.101456,
  },
  {
    id: 20193201,
    // 망우공원-형제약수터_20190101_065904 (중랑구 신내2동)
    name: "중랑구 망우공원–형제약수터 코스",
    area: "중랑구",
    distanceKm: 12.24,
    level: levelFromDistance(12.24),
    description: "서울특별시 중랑구 신내2동 일대 약 12.24km 언덕 많은 러닝 코스",
    startLat: 37.60421,
    startLng: 127.09436,
    endLat: 37.603519,
    endLng: 127.094376,
  },
  {
    id: 2019213,
    // 서울특별시광진구_20181231_201145 (광진구 군자동)
    name: "광진구 군자동 도심 코스",
    area: "광진구",
    distanceKm: 1.23,
    level: levelFromDistance(1.23),
    description: "서울특별시 광진구 군자동 일대 약 1.23km 짧은 도심 러닝 코스",
    startLat: 37.550049,
    startLng: 127.07354,
    endLat: 37.540985,
    endLng: 127.07019,
  },
  {
    id: 20196243,
    // 20190101_행주신성_20190101_073841 (양천구 신정2동)
    name: "양천구 신정2동 행주대교 장거리 코스",
    area: "양천구",
    distanceKm: 30.42,
    level: levelFromDistance(30.42),
    description: "서울특별시 양천구 신정2동 일대 약 30.42km 장거리 러닝 코스",
    startLat: 37.519066,
    startLng: 126.875793,
    endLat: 37.516914,
    endLng: 126.877876,
  },
  {
    id: 20192271,
    // 서울특별시은평구_20190101_063936 (은평구 응암1동)
    name: "은평구 응암1동 불광천 코스",
    area: "은평구",
    distanceKm: 15.25,
    level: levelFromDistance(15.25),
    description: "서울특별시 은평구 응암1동 일대 약 15.25km 불광천 러닝 코스",
    startLat: 37.597164,
    startLng: 126.91555,
    endLat: 37.597187,
    endLng: 126.915512,
  },
  {
    id: 20192349,
    // 서울특별시구로구_20190101_072006 (구로구 고척1동)
    name: "구로구 고척1동 안양천 코스",
    area: "구로구",
    distanceKm: 16.31,
    level: levelFromDistance(16.31),
    description: "서울특별시 구로구 고척1동 일대 약 16.31km 안양천 러닝 코스",
    startLat: 37.496597,
    startLng: 126.862411,
    endLat: 37.518387,
    endLng: 126.877693,
  },
  {
    id: 20191424,
    // 서울특별시중구_20190101_063817 (중구 필동)
    name: "중구 필동 남산 순환 코스",
    area: "중구",
    distanceKm: 9.2,
    level: levelFromDistance(9.2),
    description: "서울특별시 중구 필동 일대 약 9.2km 남산 러닝 코스",
    startLat: 37.555298,
    startLng: 126.985023,
    endLat: 37.555332,
    endLng: 126.985031,
  },
  {
    id: 20196338,
    // 양화폭포근린공원_20190101_090412 (영등포구 여의동)
    name: "영등포구 양화폭포 근린공원 코스",
    area: "영등포구",
    distanceKm: 21.7,
    level: levelFromDistance(21.7),
    description: "서울특별시 영등포구 여의동 일대 약 21.7km 한강 러닝 코스",
    startLat: 37.530025,
    startLng: 126.930115,
    endLat: 37.52832,
    endLng: 126.931541,
  },
  {
    id: 2019454,
    // 서울특별시양천구_20190101_042731 (양천구 신월7동)
    name: "양천구 신월7동 목동·신정 코스",
    area: "양천구",
    distanceKm: 10.15,
    level: levelFromDistance(10.15),
    description: "서울특별시 양천구 신월7동 일대 약 10.15km 도심 러닝 코스",
    startLat: 37.518295,
    startLng: 126.835342,
    endLat: 37.51815,
    endLng: 126.835052,
  },
  {
    id: 2019484,
    // 서오릉-창릉천-구파발-연신내_20190101_050426 (은평구 갈현2동)
    name: "은평구 서오릉–창릉천–연신내 코스",
    area: "은평구",
    distanceKm: 13.2,
    level: levelFromDistance(13.2),
    description: "서울특별시 은평구 갈현2동 일대 약 13.2km 복합 러닝 코스",
    startLat: 37.61412,
    startLng: 126.915306,
    endLat: 37.614098,
    endLng: 126.915421,
  },
  {
    id: 2019541,
    // 서울특별시강동구_20181230_053021 (강동구 천호2동)
    name: "강동구 천호2동 한강 장거리 코스",
    area: "강동구",
    distanceKm: 27.49,
    level: levelFromDistance(27.49),
    description: "서울특별시 강동구 천호2동 일대 약 27.49km 한강 장거리 코스",
    startLat: 37.544685,
    startLng: 127.118973,
    endLat: 37.54166,
    endLng: 127.116051,
  },
  {
    id: 20195428,
    // 건대ㅡ 서울어린이대공원20190101065701gpx (광진구 구의1동)
    name: "광진구 건대–서울어린이대공원 코스",
    area: "광진구",
    distanceKm: 12.16,
    level: levelFromDistance(12.16),
    description: "서울특별시 광진구 구의1동 일대 약 12.16km 도심 공원 러닝 코스",
    startLat: 37.540894,
    startLng: 127.08696,
    endLat: 37.541256,
    endLng: 127.087097,
  },
  {
    id: 2019608,
    // 서울특별시양천구_20190101_062012 (양천구 목5동)
    name: "양천구 목5동 오목공원 코스",
    area: "양천구",
    distanceKm: 3.51,
    level: levelFromDistance(3.51),
    description: "서울특별시 양천구 목5동 일대 약 3.51km 근린공원 러닝 코스",
    startLat: 37.535324,
    startLng: 126.877777,
    endLat: 37.535004,
    endLng: 126.877342,
  },
];

// 지도에서 선(Polyline) 그리기용 단순 path(시작→끝 직선)
sampleCourses.forEach((c) => {
  c.path = [
    { lat: c.startLat, lng: c.startLng },
    { lat: c.endLat, lng: c.endLng },
  ];
});

module.exports = sampleCourses;
