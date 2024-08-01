import React from 'react';
import { Panel } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

function BoxScoreTitle({ data }) {
    if (!data) return <div></div>;
    return (
        <Panel className='title' shaded>
            <h1>
                {data["teams"]["away"]["team"]["name"]}
                <div className="at-symbol">{" @ "}</div>
                {data["teams"]["home"]["team"]["name"]}
            </h1>
            <h2>{data["teams"]["away"]["teamStats"]["batting"]["runs"]} - {data["teams"]["home"]["teamStats"]["batting"]["runs"]}</h2>
        </Panel>
    );
}

function BattingNotes({ team }) {
    if (!team || !team["note"]) return <div></div>;
    return (
        <div>
            {team["note"].map((note, index) => (
                <div key={index}>
                    <span>{note["label"] + ": "}</span>
                    <span>{note["value"]}</span>
                </div>
            ))}
        </div>
    )
}

function BattingInfo({ info }) {
    if (!info) return <div></div>;
    return (
        <div className="batting-info-container">
            {info.map((val, index) => (
                <div key={index} className="batting-info-section">
                    <h3>{val["title"]}</h3>
                    {val["fieldList"].map((field, index) => (
                        <div key={index}>
                            <span className="subtitle">{field["label"] + ": "}</span>
                            <span>{field["value"]}</span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}

function BatterBoxScore({ team }) {
    if (!team) return <div></div>;

    let batters = [];
    for (let i = 0; i < team["batters"].length; i++) {
        let batterID = "ID" + team["batters"][i];
        if ("battingOrder" in team["players"][batterID]) {
            batters.push(team["players"][batterID]);
        }
    }
    batters.sort((a, b) => parseInt(a.pos) - parseInt(b.pos));

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>{team["team"]["name"]} Batters</th>
                        <th>AB</th>
                        <th>R</th>
                        <th>H</th>
                        <th>RBI</th>
                        <th>BB</th>
                        <th>K</th>
                        <th>LOB</th>
                        <th>AVG</th>
                        <th>OPS</th>
                    </tr>
                </thead>
                <tbody>
                    {batters.map((batter, index) => (
                        <tr key={index}>
                            <td>
                                {batter["stats"]["batting"]["note"] ?
                                    <>
                                        <span style={{marginLeft: '16px'}}>{batter["stats"]["batting"]["note"]}</span>
                                        <span>{batter["person"]["fullName"]}</span>
                                    </> :
                                    batter["person"]["fullName"]}
                            </td>
                            <td>{batter["stats"]["batting"]["atBats"]}</td>
                            <td>{batter["stats"]["batting"]["runs"]}</td>
                            <td>{batter["stats"]["batting"]["hits"]}</td>
                            <td>{batter["stats"]["batting"]["rbi"]}</td>
                            <td>{batter["stats"]["batting"]["baseOnBalls"]}</td>
                            <td>{batter["stats"]["batting"]["strikeOuts"]}</td>
                            <td>{batter["stats"]["batting"]["leftOnBase"]}</td>
                            <td>{batter["seasonStats"]["batting"]["avg"]}</td>
                            <td>{batter["seasonStats"]["batting"]["ops"]}</td>
                        </tr>
                    ))}
                    <tr>
                        <td className='total'><b>Totals</b></td>
                        <td className='total'>{team["teamStats"]["batting"]["atBats"]}</td>
                        <td className='total'>{team["teamStats"]["batting"]["runs"]}</td>
                        <td className='total'>{team["teamStats"]["batting"]["hits"]}</td>
                        <td className='total'>{team["teamStats"]["batting"]["rbi"]}</td>
                        <td className='total'>{team["teamStats"]["batting"]["baseOnBalls"]}</td>
                        <td className='total'>{team["teamStats"]["batting"]["strikeOuts"]}</td>
                        <td className='total'>{team["teamStats"]["batting"]["leftOnBase"]}</td>
                        <td className='total'></td>
                        <td className='total'></td>
                    </tr>
                </tbody>
            </table>
            <BattingNotes team={team} />
            <BattingInfo info={team["info"]} />
        </>
    );
}

function PitcherBoxScore({ team }) {
    if (!team) return <div></div>;

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>{team["team"]["name"]} Pitchers</th>
                        <th>IP</th>
                        <th>H</th>
                        <th>R</th>
                        <th>ER</th>
                        <th>BB</th>
                        <th>K</th>
                        <th>HR</th>
                        <th>ERA</th>
                    </tr>
                </thead>
                <tbody>
                    {team["pitchers"].map((pitcher, index) => (
                        <tr key={index}>
                            <td>{<>
                                {team["players"]["ID" + pitcher]["person"]["fullName"] + " "}
                            {team["players"]["ID" + pitcher]["stats"]["pitching"]["note"] ?
                                <span>{team["players"]["ID" + pitcher]["stats"]["pitching"]["note"]}</span> : null}
                            </>}</td>
                            <td>{team["players"]["ID" + pitcher]["stats"]["pitching"]["inningsPitched"]}</td>
                            <td>{team["players"]["ID" + pitcher]["stats"]["pitching"]["hits"]}</td>
                            <td>{team["players"]["ID" + pitcher]["stats"]["pitching"]["runs"]}</td>
                            <td>{team["players"]["ID" + pitcher]["stats"]["pitching"]["earnedRuns"]}</td>
                            <td>{team["players"]["ID" + pitcher]["stats"]["pitching"]["baseOnBalls"]}</td>
                            <td>{team["players"]["ID" + pitcher]["stats"]["pitching"]["strikeOuts"]}</td>
                            <td>{team["players"]["ID" + pitcher]["stats"]["pitching"]["homeRuns"]}</td>
                            <td>{team["players"]["ID" + pitcher]["seasonStats"]["pitching"]["era"]}</td>
                        </tr>
                    ))}
                    <tr>
                        <td className='total'><b>Totals</b></td>
                        <td className='total'>{team["teamStats"]["pitching"]["inningsPitched"]}</td>
                        <td className='total'>{team["teamStats"]["pitching"]["hits"]}</td>
                        <td className='total'>{team["teamStats"]["pitching"]["runs"]}</td>
                        <td className='total'>{team["teamStats"]["pitching"]["earnedRuns"]}</td>
                        <td className='total'>{team["teamStats"]["pitching"]["baseOnBalls"]}</td>
                        <td className='total'>{team["teamStats"]["pitching"]["strikeOuts"]}</td>
                        <td className='total'>{team["teamStats"]["pitching"]["homeRuns"]}</td>
                        <td className='total'></td>
                    </tr>
                </tbody>
            </table>
        </>
    );
}

function ExtraInfoBoxScore({ info }) {
    if (!info) return <div></div>;

    return (
        <Panel shaded>
            <h3>Other Info</h3>
            {info.map((val, index) => (
                <div key={index}>
                    {val.value ? (
                        <>
                            <span className='subtitle'>{val.label}</span>
                            <span>{": "}</span>
                            <span>{val.value}</span>
                        </>
                    ) : (
                        <>
                            <span className='subtitle'>Day: </span>
                            <span>{val.label}</span>
                        </>
                    )}
                </div>
            ))}
        </Panel>
    );
}

export { BatterBoxScore, PitcherBoxScore, ExtraInfoBoxScore, BoxScoreTitle }