import React from 'react';
import { Panel, Row } from 'rsuite';
import ScoreBox from "./scorebox";
import 'rsuite/dist/rsuite.min.css';
import '../styles/scoreboard.css';

function Scoreboard({ data, navbarHeight }) {
    if (!data || !data["dates"] || data["dates"].length === 0 || !data["dates"][0]["games"]) return <div></div>;

    return (
        <Panel shaded bordered className="scoreboard">
            <Row className={"row"}>
                {data["dates"][0]["games"].map((game, index) => {
                    return <ScoreBox key={index} game={game} navbarHeight={navbarHeight} />;
                })}
            </Row>
        </Panel>
    );
}

export default Scoreboard;