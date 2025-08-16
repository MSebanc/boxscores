import React, { useMemo } from 'react';
import 'rsuite/dist/rsuite.min.css';
import { useBoxScore } from "../utils/apicalls";
import { BatterBoxScore, PitcherBoxScore, ExtraInfoBoxScore, BoxScoreTitle } from "./boxscorePieces";
import LineScore from "./linescore";

const BoxScore = ({ gamePk, homeName, awayName, gameState }) => {
    const { data } = useBoxScore(gamePk);

    const teamData = useMemo(() => {
        if (!data?.teams) return null;

        return {
            away: data.teams.away,
            home: data.teams.home,
            info: data.info
        };
    }, [data?.teams, data?.info]);

    if (!gamePk || !data) return <div></div>;

    return (
        <div className="boxscore-container">
            <BoxScoreTitle data={data} />
            <div className="line-score-container">
                <LineScore
                    gamePk={gamePk}
                    homeTeam={homeName}
                    awayTeam={awayName}
                    gameState={gameState}
                />
            </div>
            <div className="batter-boxscore-flex-container">
                <div className="batter-boxscore">
                    <BatterBoxScore team={teamData?.away} />
                </div>
                <div className="batter-boxscore">
                    <BatterBoxScore team={teamData?.home} />
                </div>
            </div>
            <div className="pitcher-boxscore-flex-container">
                <div className="pitcher-boxscore">
                    <PitcherBoxScore team={teamData?.away} />
                </div>
                <div className="pitcher-boxscore">
                    <PitcherBoxScore team={teamData?.home} />
                </div>
            </div>
            <div className="extra-info-container">
                <ExtraInfoBoxScore info={teamData?.info} />
            </div>
        </div>
    );
};

export default React.memo(BoxScore);