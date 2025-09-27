import React from "react";
import "./Leaderboard.css";
import LoadingIndicator from "../LoadingIndicator";
import { getLeaderboardTop50 } from "../../client-api";
import { MOCK_LEADERBOARD_TOP50 } from "../../constants";
import { LeaderboardRow } from "../leaderboard/LeaderboardRow";

const LeaderboardEntry = ({ image, index, label, value }) => {
  const color = index === "1"
    ? "#19ff00"
    : index === "2"
    ? "#0059FF"
    : index === "3"
    ? "#FFA602"
    : "#FFFFFF";

  return (
    <div className="frame-2">
      <div className="text-wrapper-4" style={{ color }}>{index}</div>

      {image ? (
        <img
          className="ellipse"
          alt={label}
          src={image}
          style={{ width: 50, height: 50, borderRadius: "50%", objectFit: "cover" }}
        />
      ) : (
        <div className="ellipse" />
      )}

      <div className="overlap-group">
        <div className="text-wrapper-5">{label}</div>
        <div className="text-wrapper-6">{value}</div>
      </div>
    </div>
  );
}

const Leaderboard = () => {
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        setLoading(true);
        setError(null);
        let data = await getLeaderboardTop50(controller.signal);
        // API may return array or { results: [...] }
        if (data && Array.isArray(data.results)) {
          data = data.results;
        }
        // Normalize items to the UI shape
        const normalized = (data ?? []).map((row, idx) => ({
          rank: row.rank ?? idx + 1,
          username: row.username,
          xp_value: row.xp_value,
          level: row.level,
          profile_icon: row.profile_icon,
        }));
        setItems(normalized);
      } catch (e) {
        console.error("Failed to load leaderboard:", e);
        setError(e?.message || "Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, []);

  return (
    <div className="content">
      <div className="titles">
        <div className="text-wrapper">Leaderboards</div>
        <p className="div">Top 50 Highest level globally</p>
      </div>

      <div className="line" />

      {loading ? (
        <div className="min-h-[40vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-gray-500">
            <LoadingIndicator size="16" />
            <span className="text-sm">Loading leaderboard...</span>
          </div>
        </div>
      ) : (
        <div className="scroll">
          {items.map((it) => (
            <LeaderboardRow
              key={it.rank}
              rank={it.rank}
              name={it.username}
              level={it.level}
              avatarUrl={it.profile_icon}
            />
            // <LeaderboardEntry
            //   key={it.rank}
            //   label={it.username}
            //   value={String(it.level)}
            //   index={String(it.rank)}
            //   image={it.profile_icon}
            // />
          ))}
          {items.length === 0 && (
            <div className="min-h-[30vh] flex items-center justify-center text-gray-400 text-sm">
              No leaderboard data.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
