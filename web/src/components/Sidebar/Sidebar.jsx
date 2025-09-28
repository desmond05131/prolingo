
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SidebarButton = ({ image, label, to, active }) => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => to && navigate(to)}
      className={[
        // base layout
        "group flex w-full items-center gap-6 h-12 rounded-md border px-3 transition-colors",
        // text & bg
        "hover:bg-sky-500/20",
        // active state
        active
          ? "border-primary bg-sky-500/20"
          : "border-transparent bg-transparent",
        // small screens (<=1000px) adjustments handled via custom breakpoint md: assumption: md ~ 768 so use lg for >1000; we hide text on smaller screens
      ].join(" ")}
    >
      <img alt={label} src={image} className="h-8 w-8 object-contain" />
      <span
        className={[
          "font-bold tracking-widest text-white text-[15px] font-[DinRoundPro]",
          // hide on narrower screens: replicate CSS where text hidden below 1000px
          "max-[1000px]:hidden",
        ].join(" ")}
      >
        {label}
      </span>
    </button>
  );
};

export const Sidebar = () => {
  const location = useLocation();
  return (
    <aside
      className={[
        // base vertical sidebar
        "flex flex-col items-center gap-3 p-6 h-screen z-[9999] border-r-2 border-[#354750]",
        // dark bg on narrow screens replicating original
        "max-[1000px]:fixed max-[1000px]:bottom-0 max-[1000px]:left-0 max-[1000px]:right-0 max-[1000px]:h-[60px] max-[1000px]:flex-row max-[1000px]:justify-evenly max-[1000px]:border-r-0 max-[1000px]:border-t-2 max-[1000px]:border-t-[#354750] max-[1000px]:bg-[#141B1F] max-[1000px]:p-2 max-[1000px]:gap-6",
      ].join(" ")}
    >
      <div className="flex items-center justify-center gap-3 self-stretch max-[1000px]:hidden">
        <img
          alt="Logo"
          src="/assets/Logo.png"
          className="h-8 w-8 object-contain"
        />
        <span className="text-white font-bold text-[30px] font-[DinRoundPro]">PROLINGO</span>
      </div>
      <div className="flex flex-col w-full flex-1 gap-4 max-[1000px]:flex-row max-[1000px]:h-full max-[1000px]:items-center max-[1000px]:justify-evenly">
        <SidebarButton image="https://c.animaapp.com/Xc8IGahh/img/image-22-7@2x.png" label="PROFILE" to="/profile" active={location.pathname === "/profile"} />
        <SidebarButton image="/assets/Learn.svg" label="LEARN" to="/learn" active={location.pathname === "/learn"} />
        <SidebarButton image="/assets/Leaderboards.svg" label="LEADERBOARDS" to="/leaderboards" active={location.pathname === "/leaderboards"} />
        <SidebarButton image="/assets/Achievements.svg" label="ACHIEVEMENTS" to="/achievements" active={location.pathname === "/achievements"} />
        <SidebarButton image="/assets/Settings.svg" label="SUBSCRIPTION" to="/subscription" active={location.pathname === "/subscription"} />
        <div className="mt-auto w-full max-[1000px]:mt-0 max-[1000px]:w-auto">
          <SidebarButton image="/assets/Settings.svg" label="LOGOUT" to="/logout" active={location.pathname === "/logout"} />
        </div>
      </div>
    </aside>
  );
};
