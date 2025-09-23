
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";

const SidebarButton = ({ image, label, to, active }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`frame-7${active ? " active" : ""}`}
      style={{ cursor: "pointer" }}
      onClick={() => to && navigate(to)}
    >
      <img
        className="image"
        alt="Image"
        src={image}
      />
      <div className="text-wrapper-11">{label}</div>
    </div>
  );
};

export const Sidebar = () => {
  const location = useLocation();
  return (
    <div className="sidebar">
      <div className="frame-6">
        <img
          className="logo-image"
          alt="Image"
          src="/assets/Logo.png"
        />
        <div className="text-wrapper-10">PROLINGO</div>
      </div>
      <SidebarButton image="https://c.animaapp.com/Xc8IGahh/img/image-22-7@2x.png" label="PROFILE" to="/profile" active={location.pathname === "/profile"} />
      <SidebarButton image="/assets/Learn.svg" label="LEARN" to="/learn" active={location.pathname === "/learn"} />
      <SidebarButton image="/assets/Leaderboards.svg" label="LEADERBOARDS" to="/leaderboards" active={location.pathname === "/leaderboards"} />
      <SidebarButton image="/assets/Achievements.svg" label="ACHIEVEMENTS" to="/achievements" active={location.pathname === "/achievements"} />
      <SidebarButton image="/assets/Settings.svg" label="SETTINGS" to="/settings" active={location.pathname === "/settings"} />
    </div>
  );
};
