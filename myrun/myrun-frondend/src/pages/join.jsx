// src/pages/join.jsx
import "../App.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Join() {
  const [gender, setGender] = useState("male"); // 기본값: 남자
  const navigate = useNavigate();

  // 파란 "회원가입 하기" 버튼 눌렀을 때
  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: 여기서 실제 회원가입 API 호출할 수 있음
    // 지금은 가입했다고 가정하고 로그인 화면으로 이동
    navigate("/");
  };

  // 아래 "로그인" 텍스트 눌렀을 때
  const handleLoginClick = () => {
    navigate("/");
  };

  return (
    <div className="join-page">
      <div className="join-panel">
        <h1 className="logo">MyRun</h1>
        <p className="subtitle">회원 가입</p>

        <form className="join-form" onSubmit={handleSubmit}>
          {/* 아이디 */}
          <div className="form-row">
            <label className="field-label" htmlFor="join-email">
              아이디
            </label>
            <input
              id="join-email"
              type="email"
              className="field-input"
              placeholder="아이디를 입력하세요"
            />
          </div>

          {/* 비밀번호 */}
          <div className="form-row">
            <label className="field-label" htmlFor="join-password">
              비밀번호
            </label>
            <input
              id="join-password"
              type="password"
              className="field-input"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className="form-row">
            <label className="field-label" htmlFor="join-password-confirm">
              비밀번호 확인
            </label>
            <input
              id="join-password-confirm"
              type="password"
              className="field-input"
              placeholder="비밀번호를 다시 입력하세요"
            />
          </div>

           {/* 키 / 몸무게 / 나이 */}
           <div className="form-row">
           <span className="field-label">키(cm)</span>
           <div className="form-row-inline">
               {/* 키 */}
               <div className="inline-group">
               <input
                type="text"
                inputMode="numeric"
                className="small-input"
                />
               </div>

               {/* 몸무게 */}
               <div className="inline-group">
               <span className="field-label small-label">몸무게(kg)</span>
               <input
                type="text"
                inputMode="numeric"
                className="small-input"
                />
               </div>

               {/* 나이 */}
               <div className="inline-group">
               <span className="field-label small-label">나이</span>
               <input
                type="text"
                inputMode="numeric"
                className="small-input"
                />
               </div>
           </div>
           </div>

          {/* 성별 (radio) */}
          <div className="form-row">
            <span className="field-label">성별</span>
            <div className="gender-options">
              <label className="radio-wrapper">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={(e) => setGender(e.target.value)}
                  className="gender-radio"
                />
                <span>남자</span>
              </label>

              <label className="radio-wrapper">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={(e) => setGender(e.target.value)}
                  className="gender-radio"
                />
                <span>여자</span>
              </label>
            </div>
          </div>

          {/* 파란 회원가입 버튼 */}
          <button type="submit" className="join-submit-btn">
            회원가입 하기
          </button>
        </form>

        {/* 하단 로그인 링크 */}
        <div className="join-bottom-text">
          이미 계정이 있으신가요?
          <button
            type="button"
            className="join-bottom-link"
            onClick={handleLoginClick}
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}