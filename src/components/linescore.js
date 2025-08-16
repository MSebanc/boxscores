import React, { useMemo } from 'react';
import { useLineScore } from '../utils/apicalls';
import 'rsuite/dist/rsuite.min.css';

const LineScore = ({ gamePk, awayTeam, homeTeam, gameState }) => {
    const { data } = useLineScore(gamePk);

    const tableData = useMemo(() => {
        if (!data) return null;

        const numInnings = Math.max(data.innings?.length || 0, data.scheduledInnings || 0);
        const inningsRowsAway = [];
        const inningsRowsHome = [];

        for (let i = 0; i < numInnings; i++) {
            let awayClass = "";
            let homeClass = "";

            if (gameState !== "F" && data.currentInning === i + 1) {
                if (data.isTopInning) {
                    awayClass = "gray";
                } else {
                    homeClass = "gray";
                }
            }

            const inning = data.innings?.[i];
            const awayRuns = inning?.away?.runs;
            const homeRuns = inning?.home?.runs;

            const awayRunsElement = awayRuns !== undefined
                ? <td className={awayClass} key={i}>{awayRuns}</td>
                : gameState === "F"
                    ? <td className={awayClass} key={i}>X</td>
                    : <td className={awayClass} key={i}>&nbsp;</td>;

            const homeRunsElement = homeRuns !== undefined
                ? <td className={homeClass} key={i}>{homeRuns}</td>
                : gameState === "F"
                    ? <td className={homeClass} key={i}>X</td>
                    : <td className={homeClass} key={i}>&nbsp;</td>;

            inningsRowsAway.push(awayRunsElement);
            inningsRowsHome.push(homeRunsElement);
        }

        const awayStats = data.teams?.away || {};
        const homeStats = data.teams?.home || {};

        return {
            numInnings,
            inningsRowsAway,
            inningsRowsHome,
            awayStats,
            homeStats
        };
    }, [data, gameState]);

    if (!tableData) return <div></div>;

    const { numInnings, inningsRowsAway, inningsRowsHome, awayStats, homeStats } = tableData;

    return (
        <table className="line-score-table">
            <thead>
            <tr>
                <th></th>
                {Array.from({ length: numInnings }, (_, index) => (
                    <th key={index}>{index + 1}</th>
                ))}
                <th>R</th>
                <th>H</th>
                <th>E</th>
            </tr>
            </thead>
            <tbody>
            <tr>
                <td>{awayTeam}</td>
                {inningsRowsAway}
                <td>{awayStats.runs ?? <span>&nbsp;</span>}</td>
                <td>{awayStats.hits ?? <span>&nbsp;</span>}</td>
                <td>{awayStats.errors ?? <span>&nbsp;</span>}</td>
            </tr>
            <tr>
                <td>{homeTeam}</td>
                {inningsRowsHome}
                <td>{homeStats.runs ?? <span>&nbsp;</span>}</td>
                <td>{homeStats.hits ?? <span>&nbsp;</span>}</td>
                <td>{homeStats.errors ?? <span>&nbsp;</span>}</td>
            </tr>
            </tbody>
        </table>
    );
};

export default React.memo(LineScore);