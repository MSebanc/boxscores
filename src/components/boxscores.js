import React, { useMemo } from 'react';
import { Panel } from 'rsuite';
import BoxScore from './boxscore';
import 'rsuite/dist/rsuite.min.css';
import '../styles/boxscores.css';

const BoxScores = ({ data }) => {
    const priorityTeams = ['Boston Red Sox', 'Chicago Cubs', 'Seattle Mariners', 'Kansas City Royals'];

    const games = useMemo(() => {
        const rawGames = data?.dates?.[0]?.games || [];

        return rawGames.sort((a, b) => {
            const aHasPriority = priorityTeams.includes(a.teams?.home?.team?.name) ||
                priorityTeams.includes(a.teams?.away?.team?.name);
            const bHasPriority = priorityTeams.includes(b.teams?.home?.team?.name) ||
                priorityTeams.includes(b.teams?.away?.team?.name);

            if (aHasPriority && !bHasPriority) return -1;
            if (!aHasPriority && bHasPriority) return 1;
            return 0;
        });
    }, [data]);

    const gameComponents = useMemo(() => {
        return games.map((game, index) => (
            <Panel
                id={game.gamePk}
                key={game.gamePk || index}
                shaded
                bordered
                className="boxScores"
            >
                <BoxScore
                    gamePk={game.gamePk}
                    homeName={game.teams?.home?.team?.name}
                    awayName={game.teams?.away?.team?.name}
                    gameState={game.status?.abstractGameCode}
                />
            </Panel>
        ));
    }, [games]);

    if (games.length === 0) return <div></div>;

    return <div>{gameComponents}</div>;
};

export default React.memo(BoxScores);