import React from 'react';
import { useLineScore } from '../utils/apicalls';
import 'rsuite/dist/rsuite.min.css';

function LineScore({ gamePk, awayTeam, homeTeam, gameState}) {
    const { data } = useLineScore(gamePk);

    if (!data) return <div></div>;

    const numInnings = Math.max(data["innings"].length, data["scheduledInnings"])

    let inningsRowsAway = [];
    let inningsRowsHome = [];

    for (let i = 0; i < numInnings; i++) {
        let awayClass = "", homeClass = "";
        if (gameState !== "F" && data["currentInning"] === i + 1) {
            if (data["isTopInning"]) {
                awayClass = "gray";
            } else {
                homeClass = "gray";
            }
        }

        const awayRunsElement = data["innings"][i] && data["innings"][i]["away"]["runs"] !== undefined ?
            <td className={awayClass} key={i}>{data["innings"][i]["away"]["runs"]}</td> :
            (gameState === "F" ? <td className={awayClass} key={i}>X</td> : <td className={awayClass} key={i}>&nbsp;</td>);

        const homeRunsElement = data["innings"][i] && data["innings"][i]["home"]["runs"] !== undefined ?
            <td className={homeClass} key={i}>{data["innings"][i]["home"]["runs"]}</td> :
            (gameState === "F" ? <td className={homeClass} key={i}>X</td> : <td className={homeClass} key={i}>&nbsp;</td>);

        inningsRowsAway.push(awayRunsElement);
        inningsRowsHome.push(homeRunsElement);
    }
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
                <td>{data["teams"]["away"]["runs"] !== undefined ? data["teams"]["away"]["runs"] : <span>&nbsp;</span>}</td>
                <td>{data["teams"]["away"]["hits"] !== undefined ? data["teams"]["away"]["hits"] : <span>&nbsp;</span>}</td>
                <td>{data["teams"]["away"]["errors"] !== undefined ? data["teams"]["away"]["errors"] : <span>&nbsp;</span>}</td>
            </tr>
            <tr>
                <td>{homeTeam}</td>
                {inningsRowsHome}
                <td>{data["teams"]["home"]["runs"] !== undefined ? data["teams"]["home"]["runs"] : <span>&nbsp;</span>}</td>
                <td>{data["teams"]["home"]["hits"] !== undefined ? data["teams"]["home"]["hits"] : <span>&nbsp;</span>}</td>
                <td>{data["teams"]["home"]["errors"] !== undefined ? data["teams"]["home"]["errors"] : <span>&nbsp;</span>}</td>
            </tr>
            </tbody>
        </table>
    );
}

export default LineScore;