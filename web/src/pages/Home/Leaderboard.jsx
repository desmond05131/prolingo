import Leaderboard from "../../components/HomeContent/Leaderboard";
import { Sidebar } from "../../components/Sidebar/Sidebar";
import { Stats } from "../../components/Stats/Stats";
import "../../styles/Home.css";

function LeaderboardHome() {
  return (
    <div style={{ display: "flex", flexDirection: "row", height: "100%" }}>
      <Sidebar />
      <div className="main-content">
        <Leaderboard />
      </div>
      <Stats />
    </div>
  );
}
export default LeaderboardHome;
