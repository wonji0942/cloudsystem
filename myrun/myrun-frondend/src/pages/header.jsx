import React, { useState } from "react";

const Header = () => {
    const [isOpen, setMenu] = useState(false);

    const toggleMenu = () => {
        setMenu(!isOpen);
    }
    const closeMenu=() => {
        setMenu (false);
    }

    return (
        <>
        <header className="main-header">
            <div className="main-header-logo">MyRun</div>
            <button className="main-header-menu" onClick={toggleMenu}>
                <span />
                <span />
                <span />
            </button>
        </header>
            {isOpen &&(
                <nav className="header-menu-open">
                        <ul style={{ listStyleType: "none" }}> 
                            {/*메뉴 아이템, 버튼 누르면 메뉴 닫힘*/}
                            <li><a href="/main" className="menu-list" >홈</a></li>
                            <li><a href="/record" className="menu-list">기록하기</a></li>
                            <li><a href="/recommend" className="menu-list">코스추천</a></li>
                            <li><a href="/mypage" className="menu-list">마이페이지</a></li>
                            <li><a href="/" className="menu-list">로그아웃</a></li>
                        </ul>
                    </nav>
            )
        }
        </>
    );
    
}
export default Header;