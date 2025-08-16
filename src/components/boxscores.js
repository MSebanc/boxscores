import React, { useMemo } from 'react';
import { Panel } from 'rsuite';
import BoxScore from './boxscore';
import 'rsuite/dist/rsuite.min.css';
import '../styles/boxscores.css';

const BoxScores = ({ data }) => {
    const games = useMemo(() => {
        return data?.dates?.[0]?.games || [];
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