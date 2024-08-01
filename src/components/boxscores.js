import React from 'react';
import { Panel } from 'rsuite';
import BoxScore from './boxscore';
import 'rsuite/dist/rsuite.min.css';
import '../styles/boxscores.css';

function BoxScores({ data}) {
    if (!data || !data["dates"] || data["dates"].length === 0 || !data["dates"][0]["games"]) return <div></div>;

    return (
        <div>
            {data["dates"][0]["games"].map((game, index) => (
                <Panel id={game["gamePk"]} key={index} shaded bordered className="boxScores">
                    <BoxScore
                        gamePk={game["gamePk"]}
                        homeName={game["teams"]["home"]["team"]["name"]}
                        awayName={game["teams"]["away"]["team"]["name"]}
                        gameState={game["status"]["abstractGameCode"]}
                    />
                </Panel>
            ))}
        </div>
    );
}

export default BoxScores;