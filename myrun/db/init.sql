-- db/init.sql

CREATE DATABASE IF NOT EXISTS myrun
  DEFAULT CHARACTER SET utf8mb4
  DEFAULT COLLATE utf8mb4_general_ci;

USE myrun;

-- 1) 사용자 테이블
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  height_cm INT,
  weight_kg INT,
  age INT,
  gender ENUM('male','female') DEFAULT 'male',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2) 러닝 기록 테이블
CREATE TABLE IF NOT EXISTS runs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  run_date DATE NOT NULL,
  distance_km DECIMAL(5,2) NOT NULL,
  duration_min INT NOT NULL,
  avg_speed_kmh DECIMAL(4,1) NOT NULL,
  calories INT NOT NULL,
  course_name VARCHAR(255),
  memo TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_runs_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 3) 코스 테이블
CREATE TABLE IF NOT EXISTS courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  area VARCHAR(50) NOT NULL,
  distance_km DECIMAL(5,2) NOT NULL,
  level ENUM('하','중','상') NOT NULL,
  description TEXT
);

-- 샘플 유저 (비밀번호: 1234)
INSERT INTO users (username, password, name, height_cm, weight_kg, age, gender)
VALUES ('testuser', '1234', '테스트유저', 170, 60, 23, 'male')
ON DUPLICATE KEY UPDATE username = username;

-- 샘플 러닝 기록
INSERT INTO runs (user_id, run_date, distance_km, duration_min, avg_speed_kmh, calories, course_name, memo)
SELECT id, '2025-11-15', 3.0, 70, 3.5, 250, '효창공원', '기본 예시 러닝'
FROM users WHERE username = 'testuser';

INSERT INTO runs (user_id, run_date, distance_km, duration_min, avg_speed_kmh, calories, course_name, memo)
SELECT id, '2025-11-12', 1.0, 30, 2.6, 80, '숙대 정문', '가볍게 조깅'
FROM users WHERE username = 'testuser';

INSERT INTO runs (user_id, run_date, distance_km, duration_min, avg_speed_kmh, calories, course_name, memo)
SELECT id, '2025-11-07', 6.0, 255, 4.2, 500, '한강공원', '장거리 러닝'
FROM users WHERE username = 'testuser';

-- 샘플 코스
INSERT INTO courses (name, area, distance_km, level, description)
VALUES
('효창공원 러닝코스', '용산구', 3.0, '하', '숙명여대 인근, 초보자용 순환 코스'),
('한강 잠실 러닝코스', '송파구', 5.0, '하', '잠실대교~잠실철교 구간, 평탄한 강변 코스'),
('한강 망원 러닝코스', '마포구', 8.0, '중', '망원한강공원 중심, 러너가 많은 인기 코스'),
('북한산 둘레길 러닝코스', '강북구', 10.0, '상', '오르막과 내리막이 반복되는 산악 러닝 코스'),
('서울숲-뚝섬 순환코스', '성동구', 7.0, '중', '서울숲과 뚝섬을 잇는 도심+강변 하이브리드 코스'),
('올림픽공원 러닝코스', '송파구', 5.0, '하', '올림픽공원 내부 순환, 가족 및 입문자에게 적합'),
('여의도 한강공원 코스', '영등포구', 6.0, '중', '국회의사당 인근, 야간 러닝에 인기'),
('난지 한강공원 인터벌 코스', '마포구', 3.0, '상', '직선 구간이 길어 인터벌 훈련에 적합'),
('양재천 러닝코스', '서초구', 7.5, '중', '완만한 강변길, 사계절 경관이 좋은 코스'),
('탄천 장거리 코스', '강남구', 15.0, '상', '탄천 합류부 기준 장거리 훈련용 코스');