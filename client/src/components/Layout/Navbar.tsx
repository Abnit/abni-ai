import React from "react";
import { Sun, Moon } from "lucide-react";
import "../../styles.css";

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
  toggleVoiceAgent: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isDark,
  toggleTheme,
  toggleVoiceAgent,
}) => {
  return (
    <nav className="navbar-custom">
      <a href="#" className="logo">
        ABNI
      </a>
      <div className="nav-links">
        <a
          href="#"
          className="nav-item-custom"
          onClick={(e) => {
            e.preventDefault();
            toggleVoiceAgent();
          }}
        >
          ABNI AGENT (VOICE)
        </a>
        <a href="#" className="nav-item-custom">
          ABOUT US
        </a>
        <a href="#" className="nav-item-custom">
          HISTORY
        </a>
      </div>
      <div className="right-actions">
        <button className="theme-toggle" onClick={toggleTheme}>
          {isDark ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
