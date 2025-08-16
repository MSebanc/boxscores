import React, { useMemo, useCallback } from 'react';
import { Panel, Col, Placeholder } from 'rsuite';
import { useLineScore, useTeamInfo } from "../utils/apicalls";
import 'rsuite/dist/rsuite.min.css';
import '../styles/scoreboard.css';

function getInningsMessage(status, lineScore) {
    const detailedState = status?.detailedState;
    if (detailedState === "Suspended") return detailedState;

    if (status?.abstractGameCode === "L") {
        const currentInning = lineScore?.currentInning;
        if (lineScore?.inningState === "Middle") {
            return `Mid ${currentInning}`;
        } else if (lineScore?.isTopInning) {
            return `Top ${currentInning}`;
        } else {
            return `Bot ${currentInning}`;
        }
    }

    if (detailedState === "Completed Early") {
        return `Final/${lineScore?.currentInning}`;
    }

    return detailedState;
}

const ScoreBox = ({ game, navbarHeight }) => {
    const gamePk = game?.gamePk;
    const homeTeamId = game?.teams?.home?.team?.id;
    const awayTeamId = game?.teams?.away?.team?.id;

    const { data } = useLineScore(gamePk);
    const homeTeam = useTeamInfo(homeTeamId);
    const awayTeam = useTeamInfo(awayTeamId);

    const inningsMessage = useMemo(() => {
        return game && data ? getInningsMessage(game.status, data) : null;
    }, [game, data]);

    const teamScores = useMemo(() => ({
        away: game?.teams?.away?.score,
        home: game?.teams?.home?.score
    }), [game?.teams?.away?.score, game?.teams?.home?.score]);

    const teamAbbreviations = useMemo(() => ({
        away: awayTeam.data?.teams?.[0]?.abbreviation,
        home: homeTeam.data?.teams?.[0]?.abbreviation
    }), [awayTeam.data, homeTeam.data]);

    const handleClick = useCallback(() => {
        if (!gamePk) return;
        const element = document.getElementById(gamePk);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            window.scrollTo({
                top: elementPosition,
                behavior: 'smooth'
            });
        }
    }, [gamePk, navbarHeight]);

    const showScores = inningsMessage !== "Suspended";

    return (
        <Col onClick={handleClick}>
            <Panel className="score-box">
                <table>
                    <tbody>
                    <tr>
                        <td>{teamAbbreviations.away || <Placeholder.Paragraph/>}</td>
                        {showScores && <td>{teamScores.away ?? <Placeholder.Paragraph/>}</td>}
                        <td>{inningsMessage || <Placeholder.Paragraph/>}</td>
                    </tr>
                    <tr>
                        <td>{teamAbbreviations.home || <Placeholder.Paragraph/>}</td>
                        {showScores && <td>{teamScores.home ?? <Placeholder.Paragraph/>}</td>}
                    </tr>
                    </tbody>
                </table>
            </Panel>
        </Col>
    );
};

export default React.memo(ScoreBox);