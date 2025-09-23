import { useState, useEffect } from "react";
import api from "../../api"


export function useStatsState() {
    const [level, setLevel] = useState(1);
    const [xp, setXp] = useState(0);
    const [streak, setStreak] = useState( 0);
    const [energy, setEnergy] = useState(100);

    useEffect(() => {
        getStats();
    }, []);

    const getStats = () => {
        // api
        //     .get("/api/stats/")
        //     .then((res) => res.data)
        //     .then((data) => {
        //         const stats = Array.isArray(data) ? data[0] : data;
        //         console.log(stats);

        //         if (!stats) {
        //             return
        //         }

        //         setLevel(stats.level || 1);
        //         setXp(stats.xp || 0);
        //         setStreak(stats.streak || 0);
        //         setEnergy(stats.energy || 10);
        //     })
        //     .catch((err) => alert(err));
    };

    return {
        level,
        xp,
        streak,
        energy,
    };
}
