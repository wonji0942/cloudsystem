// src/pages/header.jsx
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { clearAuth, getCurrentUser } from "../auth";

const Header = () => {
  const [isOpen, setMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const user = getCurrentUser();

  const toggleMenu = () => setMenu((prev) => !prev);
  const closeMenu = () => setMenu(false);

  const go = (path) => {
    closeMenu();
    navigate(path);
  };

  const handleLogout = () => {
    clearAuth();        // ✅ 토큰 + 유저 정보 삭제
    closeMenu();
    navigate("/");      // 로그인 페이지로 이동
  };

  // 로그인/회원가입 페이지에서는 헤더 숨김
  const hide =
    location.pathname === "/" || location.pathname.startsWith("/join");

  if (hide) return null;

  return (
    <>
      <header className="main-header">
        {/* 왼쪽 로고 */}
        <div className="main-header-logo" onClick={() => go("/main")}>
          MyRun
        </div>

        {/* 오른쪽: 유저 정보 + 로그아웃 + 메뉴 버튼 */}
        <div className="main-header-right" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div className="main-header-user">
            {user ? `${user.name || user.username} 님` : ""}
          </div>

          {/* ✅ 항상 보이는 로그아웃 버튼 */}
          <button
            className="logout-button"
            onClick={handleLogout}
            style={{
              padding: "6px 10px",
              borderRadius: "4px",
              border: "1px solid #ddd",
              color: "#111827",
              backgroundColor: "white",
              cursor: "pointer",
              fontSize: "12px",
            }}
          >
            로그아웃
          </button>

          {/* 기존 햄버거 메뉴 (모바일용) */}
          <button className="main-header-menu" onClick={toggleMenu}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* 햄버거 메뉴 열렸을 때 */}
      {isOpen && (
        <nav className="header-menu-open">
          <ul style={{ listStyleType: "none" }}>
            <li>
              <button className="menu-list" onClick={() => go("/main")}>
                홈
              </button>
            </li>
            <li>
              <button className="menu-list" onClick={() => go("/record")}>
                기록하기
              </button>
            </li>
            <li>
              <button className="menu-list" onClick={() => go("/recommend")}>
                코스추천
              </button>
            </li>
            <li>
              <button className="menu-list" onClick={() => go("/mypage")}>
                마이페이지
              </button>
            </li>
            <li>
              <button className="menu-list" onClick={handleLogout}>
                로그아웃
              </button>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
};

export default Header;
