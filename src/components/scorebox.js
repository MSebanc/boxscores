import React from 'react';
import { Panel, Col, Placeholder } from 'rsuite';
import { useLineScore, useTeamInfo } from "../utils/apicalls";
import 'rsuite/dist/rsuite.min.css';
import '../styles/scoreboard.css';

function getInningsMessage(status, lineScore) {
    let inningsMessage = status["detailedState"];
    if (inningsMessage === "Suspended") return inningsMessage;
    if (status["abstractGameCode"] === "L") {
        if (lineScore["inningState"] === "Middle") {
            inningsMessage = "Mid " + lineScore["currentInning"];
        } else if (lineScore["isTopInning"]) {
            inningsMessage = "Top " + lineScore["currentInning"];
        } else {
            inningsMessage = "Bot " + lineScore["currentInning"];
        }
    }
    if (inningsMessage === "Completed Early") {
        inningsMessage = "Final/" + lineScore["currentInning"];
    }

    return inningsMessage;
}

function ScoreBox({ game, navbarHeight }) {
    const { data } = useLineScore(game["gamePk"]);
    const homeTeam = useTeamInfo(game["teams"]["home"]["team"]["id"]);
    const awayTeam = useTeamInfo(game["teams"]["away"]["team"]["id"]);

    let inningsMessage = game && data ? getInningsMessage(game["status"], data) : null;

    const handleClick = () => {
        const element = document.getElementById(game["gamePk"]);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    };

    return (
        <Col onClick={handleClick}>
            <Panel className="score-box">
                <table>
                    <tbody>
                    <tr>
                        <td>{awayTeam.data ? awayTeam.data["teams"][0]["abbreviation"] : <Placeholder.Paragraph/>}</td>
                        {inningsMessage !== "Suspended" && <td>{game ? game["teams"]["away"]["score"] : <Placeholder.Paragraph/>}</td>}
                        <td>{(game && data) ? getInningsMessage(game["status"], data) : <Placeholder.Paragraph/>}</td>
                    </tr>
                    <tr>
                        <td>{homeTeam.data ? homeTeam.data["teams"][0]["abbreviation"] : <Placeholder.Paragraph/>}</td>
                        {inningsMessage !== "Suspended" && <td>{game ? game["teams"]["home"]["score"] : <Placeholder.Paragraph/>}</td>}
                    </tr>
                    </tbody>
                </table>
            </Panel>
        </Col>
    );
}

export default ScoreBox;