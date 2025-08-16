import React, { useMemo } from 'react';
import { Panel } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';

const BoxScoreTitle = ({ data }) => {
    if (!data) return <div></div>;

    return (
        <Panel className='title' shaded>
            <h1>
                {data?.teams?.away?.team?.name}
                <div className="at-symbol">{" @ "}</div>
                {data?.teams?.home?.team?.name}
            </h1>
            <h2>
                {data?.teams?.away?.teamStats?.batting?.runs} - {data?.teams?.home?.teamStats?.batting?.runs}
            </h2>
        </Panel>
    );
};

const BattingNotes = ({ team }) => {
    const notes = useMemo(() => {
        return team?.note || [];
    }, [team?.note]);

    if (notes.length === 0) return <div></div>;

    return (
        <div>
            {notes.map((note, index) => (
                <div key={index}>
                    <span>{note?.label}: </span>
                    <span>{note?.value}</span>
                </div>
            ))}
        </div>
    );
};

const BattingInfo = ({ info }) => {
    if (!info) return <div></div>;

    return (
        <div className="batting-info-container">
            {info.map((val, index) => (
                <div key={index} className="batting-info-section">
                    <h3>{val?.title}</h3>
                    {val?.fieldList?.map((field, fieldIndex) => (
                        <div key={fieldIndex}>
                            <span className="subtitle">{field?.label}: </span>
                            <span>{field?.value}</span>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

const BatterBoxScore = ({ team }) => {
    const sortedBatters = useMemo(() => {
        if (!team?.batters || !team?.players) return [];

        const batters = [];
        for (const batterId of team.batters) {
            const player = team.players[`ID${batterId}`];
            if (player?.battingOrder !== undefined) {
                batters.push(player);
            }
        }

        return batters.sort((a, b) => parseInt(a.pos) - parseInt(b.pos));
    }, [team?.batters, team?.players]);

    if (!team) return <div></div>;

    return (
        <>
            <table>
                <thead>
                <tr>
                    <th>{team?.team?.name} Batters</th>
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
                {sortedBatters.map((batter, index) => {
                    const battingStats = batter?.stats?.batting;
                    const seasonStats = batter?.seasonStats?.batting;
                    const note = battingStats?.note;

                    return (
                        <tr key={batter?.person?.id || index}>
                            <td>
                                {note ? (
                                    <>
                                        <span style={{marginLeft: '16px'}}>{note}</span>
                                        <span>{batter?.person?.fullName}</span>
                                    </>
                                ) : (
                                    batter?.person?.fullName
                                )}
                            </td>
                            <td>{battingStats?.atBats}</td>
                            <td>{battingStats?.runs}</td>
                            <td>{battingStats?.hits}</td>
                            <td>{battingStats?.rbi}</td>
                            <td>{battingStats?.baseOnBalls}</td>
                            <td>{battingStats?.strikeOuts}</td>
                            <td>{battingStats?.leftOnBase}</td>
                            <td>{seasonStats?.avg}</td>
                            <td>{seasonStats?.ops}</td>
                        </tr>
                    );
                })}
                <tr>
                    <td className='total'><b>Totals</b></td>
                    <td className='total'>{team?.teamStats?.batting?.atBats}</td>
                    <td className='total'>{team?.teamStats?.batting?.runs}</td>
                    <td className='total'>{team?.teamStats?.batting?.hits}</td>
                    <td className='total'>{team?.teamStats?.batting?.rbi}</td>
                    <td className='total'>{team?.teamStats?.batting?.baseOnBalls}</td>
                    <td className='total'>{team?.teamStats?.batting?.strikeOuts}</td>
                    <td className='total'>{team?.teamStats?.batting?.leftOnBase}</td>
                    <td className='total'></td>
                    <td className='total'></td>
                </tr>
                </tbody>
            </table>
            <BattingNotes team={team} />
            <BattingInfo info={team?.info} />
        </>
    );
};

const PitcherBoxScore = ({ team }) => {
    const pitcherData = useMemo(() => {
        if (!team?.pitchers || !team?.players) return [];

        return team.pitchers.map(pitcherId => {
            const player = team.players[`ID${pitcherId}`];
            return {
                id: pitcherId,
                player,
                pitchingStats: player?.stats?.pitching,
                seasonStats: player?.seasonStats?.pitching
            };
        });
    }, [team?.pitchers, team?.players]);

    if (!team) return <div></div>;

    return (
        <>
            <table>
                <thead>
                <tr>
                    <th>{team?.team?.name} Pitchers</th>
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
                {pitcherData.map(({ id, player, pitchingStats, seasonStats }, index) => (
                    <tr key={player?.person?.id || index}>
                        <td>
                            {player?.person?.fullName} {pitchingStats?.note && (
                            <span>{pitchingStats.note}</span>
                        )}
                        </td>
                        <td>{pitchingStats?.inningsPitched}</td>
                        <td>{pitchingStats?.hits}</td>
                        <td>{pitchingStats?.runs}</td>
                        <td>{pitchingStats?.earnedRuns}</td>
                        <td>{pitchingStats?.baseOnBalls}</td>
                        <td>{pitchingStats?.strikeOuts}</td>
                        <td>{pitchingStats?.homeRuns}</td>
                        <td>{seasonStats?.era}</td>
                    </tr>
                ))}
                <tr>
                    <td className='total'><b>Totals</b></td>
                    <td className='total'>{team?.teamStats?.pitching?.inningsPitched}</td>
                    <td className='total'>{team?.teamStats?.pitching?.hits}</td>
                    <td className='total'>{team?.teamStats?.pitching?.runs}</td>
                    <td className='total'>{team?.teamStats?.pitching?.earnedRuns}</td>
                    <td className='total'>{team?.teamStats?.pitching?.baseOnBalls}</td>
                    <td className='total'>{team?.teamStats?.pitching?.strikeOuts}</td>
                    <td className='total'>{team?.teamStats?.pitching?.homeRuns}</td>
                    <td className='total'></td>
                </tr>
                </tbody>
            </table>
        </>
    );
};

const ExtraInfoBoxScore = ({ info }) => {
    if (!info) return <div></div>;

    return (
        <Panel shaded>
            <h3>Other Info</h3>
            {info.map((val, index) => (
                <div key={index}>
                    {val?.value ? (
                        <>
                            <span className='subtitle'>{val.label}</span>
                            <span>: </span>
                            <span>{val.value}</span>
                        </>
                    ) : (
                        <>
                            <span className='subtitle'>Day: </span>
                            <span>{val?.label}</span>
                        </>
                    )}
                </div>
            ))}
        </Panel>
    );
};

const MemoizedBatterBoxScore = React.memo(BatterBoxScore);
const MemoizedPitcherBoxScore = React.memo(PitcherBoxScore);
const MemoizedExtraInfoBoxScore = React.memo(ExtraInfoBoxScore);
const MemoizedBoxScoreTitle = React.memo(BoxScoreTitle);
const MemoizedBattingNotes = React.memo(BattingNotes);
const MemoizedBattingInfo = React.memo(BattingInfo);

export {
    MemoizedBatterBoxScore as BatterBoxScore,
    MemoizedPitcherBoxScore as PitcherBoxScore,
    MemoizedExtraInfoBoxScore as ExtraInfoBoxScore,
    MemoizedBoxScoreTitle as BoxScoreTitle,
    MemoizedBattingNotes as BattingNotes,
    MemoizedBattingInfo as BattingInfo
};