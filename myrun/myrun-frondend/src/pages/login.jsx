// src/pages/login.jsx
import "../App.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  // 로그인 버튼 눌렀을 때 → 메인 페이지로 이동
  const handleLogin = (e) => {
    e.preventDefault();      // 새로고침 방지
    // TODO: 나중에 여기에서 실제 로그인 검증 로직 추가
    navigate("/main");
  };

  // 회원가입하기 눌렀을 때 → /join 으로 이동
  const handleSignupClick = () => {
    navigate("/join");
  };

  return (
    <div className="login-page">
      <div className="login-panel">
        <h1 className="logo">MyRun</h1>
        <p className="subtitle">서울 기반 코스 추천 서비스</p>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="field-label" htmlFor="email">
              아이디
            </label>
            <input
              id="email"
              type="email"
              className="field-input"
              placeholder="아이디를 입력하세요"
            />
          </div>

          <div className="form-group">
            <label className="field-label" htmlFor="password">
              비밀번호
            </label>
            <input
              id="password"
              type="password"
              className="field-input"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          {/* 파란 로그인 버튼 */}
          <button type="submit" className="login-submit-btn">
            로그인
          </button>
        </form>

        {/* 로그인 아래 회원가입 링크 */}
        <button
          type="button"
          className="link-button"
          onClick={handleSignupClick}
        >
          회원가입하기
        </button>
      </div>
    </div>
  );
}