import React, { useState, useEffect } from "react";

const Header = () => {
    const [isOpen, setMenu] = useState(false);

    const toggleMenu = () => {
        setMenu(!isOpen);
    }

    return (
        <header className="main-header">
            <div className="main-header-logo">MyRun</div>
            <button className="main-header-menu" onClick={toggleMenu}>
                <span />
                <span />
                <span />
            </button>

        </header>
    );
}
export default Header;