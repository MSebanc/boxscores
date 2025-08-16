import React from 'react';
import { Panel, Row } from 'rsuite';
import ScoreBox from "./scorebox";
import 'rsuite/dist/rsuite.min.css';
import '../styles/scoreboard.css';

const Scoreboard = ({ data, navbarHeight }) => {
    // Early return with defensive checks
    if (!data?.dates?.[0]?.games?.length) {
        return null;
    }

    const games = data.dates[0].games;

    return (
        <Panel shaded bordered className="scoreboard">
            <Row className="row">
                {games.map((game, index) => (
                    <ScoreBox
                        key={game.gamePk || index}
                        game={game}
                        navbarHeight={navbarHeight}
                    />
                ))}
            </Row>
        </Panel>
    );
};

export default React.memo(Scoreboard);