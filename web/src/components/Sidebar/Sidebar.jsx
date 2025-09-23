import React, { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import "./Sidebar.css";

const SidebarButton = ({ image, label }) => {
  return (
    <div className="frame-7">
      <img className="image" alt="Image" src={image} />

      <div className="text-wrapper-11">{label}</div>
    </div>
  );
};

// export const Sidebar = ({ className }) => {
//   return (
//     <div className={`sidebar ${className}`}>
//         <div className="frame-6">
//             <img
//             className="image"
//             alt="Image"
//             src="/assets/Logo.png"
//             />

//             <div className="text-wrapper-10">PROLINGO</div>
//         </div>
//         <SidebarButton image = "https://c.animaapp.com/Xc8IGahh/img/image-22-7@2x.png" label = "PROFILE" />
//         <SidebarButton image = "/assets/Learn.svg" label = "LEARN" />
//         <SidebarButton image = "/assets/Leaderboards.svg" label = "LEADERBOARDS" />
//         <SidebarButton image = "/assets/Achievements.svg" label = "ACHIEVEMENTS" />
//         <SidebarButton image = "/assets/Settings.svg" label = "SETTINGS" />
//     </div>
//   );
// };

const LeftBarMoreMenuSvg = (props) => {
  return (
    <svg width="46" height="46" viewBox="0 0 46 46" fill="none" {...props}>
      <circle
        cx="23"
        cy="23"
        r="19"
        fill="#CE82FF"
        stroke="#CE82FF"
        strokeWidth="2"
      />
      <circle cx="15" cy="23" r="2" fill="white" />
      <circle cx="23" cy="23" r="2" fill="white" />
      <circle cx="31" cy="23" r="2" fill="white" />
    </svg>
  );
};

export const Sidebar = () => {
  const loggedIn = true;
  const logOut = true;

  const [moreMenuShown, setMoreMenuShown] = useState(false);
  // Active tab now derived from current location instead of local selectedTab state.
  const location = useLocation();

  // const bottomBarItems = useBottomBarItems();
  const bottomBarItems = [
    {
      name: "PROFILE",
      href: "/profile",
      icon: (
        <img
          src="https://c.animaapp.com/Xc8IGahh/img/image-22-7@2x.png"
          className="h-10 w-10 my-2"
        />
      ),
    },
    {
      name: "LEARN",
      href: "/",
      icon: <img src="/assets/Learn.svg" className="h-10 w-10 my-2" />,
    },
    {
      name: "LEADERBOARDS",
      href: "/leaderboards",
      icon: <img src="/assets/Leaderboards.svg" className="h-10 w-10 my-2" />,
    },
    {
      name: "ACHIEVEMENTS",
      href: "/achievements",
      icon: <img src="/assets/Achievements.svg" className="h-10 w-10 my-2" />,
    },
    {
      name: "SETTINGS",
      href: "/settings",
      icon: <img src="/assets/Settings.svg" className="h-10 w-10 my-2" />,
    },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 top-0 hidden flex-col gap-5 border-r-2 border-[#e5e5e5] bg-background p-3 md:flex lg:w-64 lg:p-5">
        <Link
          to="/learn"
          className="mb-5 ml-5 mt-5 hidden text-3xl font-bold text-[#58cc02] lg:block"
        >
          PROLINGO
        </Link>
        <ul className="flex flex-col items-stretch gap-3">
          {bottomBarItems.map((item) => {
            // Determine active by exact match or prefix (for nested routes) except root
            const isActive = location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href + "/"));
            return (
              <li key={item.href} className="flex flex-1">
                <NavLink
                  to={item.href}
                  className={({ isActive: navIsActive }) => {
                    const active = navIsActive || isActive; // navIsActive covers exact & pattern matches per RRD
                    return [
                      "flex grow items-center gap-3 rounded-xl px-2 py-1 text-sm font-bold uppercase transition-colors",
                      active
                        ? "border-2 border-[#84d8ff] bg-[#ddf4ff] text-blue-400"
                        : "text-gray-400 hover:bg-gray-100",
                    ].join(" ");
                  }}
                  end={item.href === "/"} // ensure root only active on exact
                >
                  {item.icon} <span className="sr-only lg:not-sr-only">{item.name}</span>
                </NavLink>
              </li>
            );
          })}
          <div
            className="relative flex grow cursor-default items-center gap-3 rounded-xl px-2 py-1 font-bold uppercase text-gray-400 hover:bg-gray-100"
            onClick={() => setMoreMenuShown((x) => !x)}
            onMouseEnter={() => setMoreMenuShown(true)}
            onMouseLeave={() => setMoreMenuShown(false)}
            role="button"
            tabIndex={0}
          >
            <LeftBarMoreMenuSvg />{" "}
            <span className="hidden text-sm lg:inline">More</span>
            <div
              className={[
                "absolute left-full top-[-10px] min-w-[300px] rounded-2xl border-2 border-gray-300 bg-white text-left text-gray-400",
                moreMenuShown ? "" : "hidden",
              ].join(" ")}
            >
              <div className="flex flex-col py-2">
                <Link
                  className="flex items-center gap-4 px-5 py-2 text-left uppercase hover:bg-gray-100"
                  to="https://schools.duolingo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* <GlobeIconSvg className="h-10 w-10" /> */}
                  Schools
                </Link>
                <Link
                  className="flex items-center gap-4 px-5 py-2 text-left uppercase hover:bg-gray-100"
                  to="https://podcast.duolingo.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {/* <PodcastIconSvg className="h-10 w-10" /> */}
                  Podcast
                </Link>
              </div>
              <div className="flex flex-col border-t-2 border-gray-300 py-2">
                {/* Placeholder for unauthenticated action; implement login/signup modal trigger when auth is added */}
                {!loggedIn && (
                  <button
                    className="px-5 py-2 text-left uppercase hover:bg-gray-100"
                    onClick={() => console.log("Trigger signup flow")}
                  >
                    Create a profile
                  </button>
                )}
                <Link
                  className="px-5 py-2 text-left uppercase hover:bg-gray-100"
                  to={loggedIn ? "/settings/account" : "/settings/sound"}
                >
                  Settings
                </Link>
                <a
                  className="px-5 py-2 text-left uppercase hover:bg-gray-100"
                  href="https://support.duolingo.com/hc/en-us"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Help
                </a>
                {loggedIn && (
                  <button
                    className="px-5 py-2 text-left uppercase hover:bg-gray-100"
                    onClick={logOut}
                  >
                    Sign out
                  </button>
                )}
              </div>
            </div>
          </div>
        </ul>
      </nav>
    </>
  );
};
