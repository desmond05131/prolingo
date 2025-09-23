/*
We're constantly improving the code you see.
Please share your feedback here: https://form.asana.com/?k=uvp-HPgd3_hyoXRBw1IcNg&d=1152665201300829
*/

import { useStatsState } from "./useStatsState.jsx"
import "./Stats.css";

const EnergyIcon = ({ i, percent }) => (
  <svg className={`icon icon-${i}`} fill="#FFF600" width="48" height="48">
    <defs>
      <linearGradient id={`energy-gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset={`${percent}%`} stopColor="black" stopOpacity="1" />
        <stop offset={`${percent}%`} stopColor="transparent" stopOpacity="0" />
      </linearGradient>
    </defs>
    <use xlinkHref={`/assets/Energy.svg#icon-${i}`} />
    <rect width="48" height="48" fill={`url(#energy-gradient-${i})`} />
  </svg>
);

export const Stats = ({
    className
}) => {
    const { level, xp, energy, streak } = useStatsState();

    return (
        <div className={`stats ${className}`}>
        <div className="heading">
            <div className="frame-9">
            <div className="frame-10">
                <img
                className="fire"
                alt="Fire"
                src="/assets/Streak.svg"
                />

                <div className="text-wrapper-12">{streak}</div>
            </div>

            <div className="frame-10">
                <img
                className="frame-11"
                alt="Frame"
                src="/assets/Energy.svg"
                />

                <div className="text-wrapper-13">{energy}</div>
            </div>
            </div>
        </div>

        <div className="div-2">
            <div className="label">Current Level</div>

            <div className="content-2">
            <div className="level">{level}</div>

            <div className="bar" style={{ background: '#28363E', borderRadius: 8, height: 12, width: '100%', marginTop: 8 }}>
                <div
                    className="progress"
                    style={{
                        width: `${Math.min((xp / (level*50 + 50)) * 100, 100)}%`,
                        background: '#60CC04',
                        height: '100%',
                        borderRadius: 8,
                        transition: 'width 0.3s',
                    }}
                />
            </div>
            </div>
        </div>


        <div className="div-2">
            <div className="label">Leaderboards Rank</div>

            <div className="content-3">
            <img className="icon" alt="Icon" src="/assets/Leaderboard.svg" />

            <div className="label-2">No Rank</div>
            </div>
        </div>
        </div>
    );
};
