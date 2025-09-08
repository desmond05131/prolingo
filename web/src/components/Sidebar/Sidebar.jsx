import React from "react";
import "./Sidebar.css";

const SidebarButton = ({ image, label }) => {
    return (
        <div className="frame-7">
        <img
          className="image"
          alt="Image"
          src={image}
        />

        <div className="text-wrapper-11">{label}</div>
      </div>
    )
}

export const Sidebar = ({ className }) => {
  return (
    <div className={`sidebar ${className}`}>
        <div className="frame-6">
            <img
            className="image"
            alt="Image"
            src="/assets/Logo.png"
            />

            <div className="text-wrapper-10">PROLINGO</div>
        </div>
        <SidebarButton image = "https://c.animaapp.com/Xc8IGahh/img/image-22-7@2x.png" label = "PROFILE" />
        <SidebarButton image = "/assets/Learn.svg" label = "LEARN" />
        <SidebarButton image = "/assets/Leaderboards.svg" label = "LEADERBOARDS" />
        <SidebarButton image = "/assets/Achievements.svg" label = "ACHIEVEMENTS" />
        <SidebarButton image = "/assets/Settings.svg" label = "SETTINGS" />
    </div>
  );
};
