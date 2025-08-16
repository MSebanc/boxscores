import React from 'react';
import '../styles/title.css';

const Title = ({ date }) => {
    return (
        <div>
            <h1>MLB Box Scores<span>{date || ''}</span></h1>
        </div>
    );
};

export default React.memo(Title);