import React from 'react';
import 'rsuite/dist/rsuite.min.css';
import {useBoxScore} from "../utils/apicalls";
import {BatterBoxScore, PitcherBoxScore, ExtraInfoBoxScore, BoxScoreTitle} from "./boxscorePieces";
import LineScore from "./linescore";

function BoxScore({ gamePk, homeName, awayName, gameState}) {
    const {data} = useBoxScore(gamePk);

    if (!gamePk || !data) return <div></div>;
    return (
        <div className="boxscore-container">
            <BoxScoreTitle data={data} />
            <div className="line-score-container">
                <LineScore
                    gamePk={ gamePk }
                    homeTeam={homeName}
                    awayTeam={awayName}
                    gameState={gameState}
                />
            </div>
            <div className="batter-boxscore-flex-container">
                <div className="batter-boxscore">
                    <BatterBoxScore team={data["teams"]["away"]} />
                </div>
                <div className="batter-boxscore">
                    <BatterBoxScore team={data["teams"]["home"]} />
                </div>
            </div>
            <div className="pitcher-boxscore-flex-container">
                <div className="pitcher-boxscore">
                    <PitcherBoxScore team={data["teams"]["away"]} />
                </div>
                <div className="pitcher-boxscore">
                    <PitcherBoxScore team={data["teams"]["home"]} />
                </div>
            </div>
            <div className="extra-info-container">
                <ExtraInfoBoxScore info={data["info"]} />
            </div>
        </div>
    );
}

export default BoxScore;